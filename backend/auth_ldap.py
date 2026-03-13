"""
LDAP / Active Directory authentication helper
Simpan di: backend/auth_ldap.py

Dependencies:
    pip install ldap3
"""

import os
import re
from ldap3 import Server, Connection, ALL, NTLM, Tls, SUBTREE
from ldap3.core.exceptions import LDAPException, LDAPBindError
import ssl

# ── Config dari environment ───────────────────────────────────
LDAP_ENABLED        = os.environ.get("LDAP_ENABLED", "false").lower() == "true"
LDAP_URL            = os.environ.get("LDAP_URL", "")
LDAP_BIND_DN        = os.environ.get("LDAP_BIND_DN", "")
LDAP_BIND_PASSWORD  = os.environ.get("LDAP_BIND_PASSWORD", "")
LDAP_SEARCH_BASE    = os.environ.get("LDAP_SEARCH_BASE", "DC=gyssteel,DC=com")
LDAP_SEARCH_FILTER  = os.environ.get("LDAP_SEARCH_FILTER", "(sAMAccountName={username})")
LDAP_TLS_REJECT     = os.environ.get("LDAP_TLS_REJECT_UNAUTHORIZED", "true").lower() == "true"

LDAP_USERNAME_ATTR    = os.environ.get("LDAP_USERNAME_ATTRIBUTE",    "sAMAccountName")
LDAP_MAIL_ATTR        = os.environ.get("LDAP_MAIL_ATTRIBUTE",        "mail")
LDAP_DISPLAYNAME_ATTR = os.environ.get("LDAP_DISPLAYNAME_ATTRIBUTE", "cn")
LDAP_FIRSTNAME_ATTR   = os.environ.get("LDAP_FIRSTNAME_ATTRIBUTE",   "givenName")
LDAP_LASTNAME_ATTR    = os.environ.get("LDAP_LASTNAME_ATTRIBUTE",     "sn")

# OU yang mendapat akses admin otomatis
ADMIN_OU = "OU=MIS"


def _build_server() -> Server:
    """Buat LDAP Server object, support LDAPS dengan self-signed cert."""
    use_ssl = LDAP_URL.startswith("ldaps://")
    tls = None
    if use_ssl and not LDAP_TLS_REJECT:
        tls = Tls(validate=ssl.CERT_NONE)
    return Server(LDAP_URL, use_ssl=use_ssl, tls=tls, get_info=ALL)


def _extract_ou(dn: str) -> list[str]:
    """
    Ekstrak semua OU dari Distinguished Name.
    Contoh: 'CN=John,OU=MIS,OU=Account IT,DC=gyssteel,DC=com'
    → ['MIS', 'Account IT']
    """
    return re.findall(r'OU=([^,]+)', dn, re.IGNORECASE)


def _is_mis_member(user_dn: str, member_of: list) -> bool:
    """
    Cek apakah user ada di OU=MIS berdasarkan:
    1. DN-nya sendiri mengandung OU=MIS
    2. Group membership mengandung MIS
    """
    ous = _extract_ou(user_dn)
    if any("MIS" in ou.upper() for ou in ous):
        return True
    # Cek dari memberOf groups juga
    for group in (member_of or []):
        if "MIS" in group.upper():
            return True
    return False


def ldap_authenticate(username: str, password: str) -> dict | None:
    """
    Autentikasi user via LDAP.

    Return dict user info jika sukses, None jika gagal.

    Returned dict:
    {
        "username":    str,
        "email":       str,
        "name":        str,
        "dn":          str,
        "ous":         list[str],
        "is_mis":      bool,       # True → otomatis admin
        "auth_type":   "ldap",
    }
    """
    if not LDAP_ENABLED:
        return None

    try:
        server = _build_server()

        # Step 1: Bind dengan service account untuk search user DN
        conn = Connection(server, user=LDAP_BIND_DN, password=LDAP_BIND_PASSWORD, auto_bind=True)

        # Step 2: Search user berdasarkan sAMAccountName
        search_filter = LDAP_SEARCH_FILTER.replace("{{username}}", username)
        attrs = [
            LDAP_USERNAME_ATTR,
            LDAP_MAIL_ATTR,
            LDAP_DISPLAYNAME_ATTR,
            LDAP_FIRSTNAME_ATTR,
            LDAP_LASTNAME_ATTR,
            "distinguishedName",
            "memberOf",
        ]
        conn.search(
            search_base=LDAP_SEARCH_BASE,
            search_filter=search_filter,
            search_scope=SUBTREE,
            attributes=attrs,
        )

        if not conn.entries:
            return None  # User tidak ditemukan di AD

        entry    = conn.entries[0]
        user_dn  = str(entry.distinguishedName) if entry.distinguishedName else ""
        member_of = [str(g) for g in entry.memberOf] if hasattr(entry, "memberOf") and entry.memberOf else []

        # Step 3: Bind ulang dengan kredensial user untuk verifikasi password
        user_conn = Connection(server, user=user_dn, password=password, auto_bind=True)
        user_conn.unbind()
        conn.unbind()

        # Step 4: Kumpulkan info user
        email     = str(entry[LDAP_MAIL_ATTR])        if entry[LDAP_MAIL_ATTR]        else f"{username}@gyssteel.com"
        name      = str(entry[LDAP_DISPLAYNAME_ATTR]) if entry[LDAP_DISPLAYNAME_ATTR] else username
        ous       = _extract_ou(user_dn)
        is_mis    = _is_mis_member(user_dn, member_of)

        return {
            "username":  username,
            "email":     email,
            "name":      name,
            "dn":        user_dn,
            "ous":       ous,
            "is_mis":    is_mis,
            "auth_type": "ldap",
        }

    except LDAPBindError:
        # Password salah
        return None
    except LDAPException as e:
        print(f"[LDAP] Error: {e}")
        return None
    except Exception as e:
        print(f"[LDAP] Unexpected error: {e}")
        return None
