import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

function RichTextEditor({ value, onChange, placeholder, dataTestId }) {
  var editor = useRef(null);

  var config = useMemo(function() {
    return {
      readonly: false,
      placeholder: placeholder || 'Write your content here...',
      height: 300,
      toolbarAdaptive: false,
      buttons: [
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'font', 'fontsize', 'paragraph', '|',
        'left', 'center', 'right', 'justify', '|',
        'brush', '|',
        'link', 'image', '|',
        'hr', 'table', '|',
        'undo', 'redo', '|',
        'eraser', 'source'
      ],
      uploader: { insertImageAsBase64URI: true },
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html',
      style: {
        fontFamily: 'inherit',
      },
    };
  }, [placeholder]);

  return (
    <div className="rich-text-editor" data-testid={dataTestId}>
      <JoditEditor
        ref={editor}
        value={value || ''}
        config={config}
        onBlur={function(newContent) { onChange(newContent); }}
      />
      <style>{`
        .rich-text-editor .jodit-container {
          border-color: #e2e8f0 !important;
          border-radius: 0.5rem !important;
          overflow: hidden;
        }
        .rich-text-editor .jodit-toolbar__box {
          background: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .rich-text-editor .jodit-workplace {
          min-height: 200px;
        }
        .rich-text-editor .jodit-wysiwyg {
          padding: 12px 16px !important;
          line-height: 1.7 !important;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
