import '../style/tinymce.css';
import { Editor as TinyMceReactEditor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useEffect, useRef } from 'react';
import { File } from 'renderer/contracts/file';

const { electron } = window;

require('tinymce/tinymce');
require('tinymce/plugins/code/index');
require('tinymce/themes/silver/index');
require('tinymce/models/dom/index');
require('tinymce/icons/default/index');

interface EditorProps {
  initialContent: string;
  file: File;
}
export default function Editor({ initialContent, file }: EditorProps) {
  const editorRef = useRef<TinyMCEEditor>();

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current?.getContent());
    }
  };

  useEffect(() => {
    electron.ipcRenderer.on('start-save-file', () => {
      electron.ipcRenderer.send('save-file', {
        ...file,
        content: editorRef.current?.getContent(),
      });
    });
  }, [file]);

  return (
    <>
      <TinyMceReactEditor
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        initialValue={initialContent}
        init={{
          skin: false,
          content_css: false,
          height: '90vh',
          menubar: false,
          plugins: 'code',
          toolbar_mode: 'wrap',
          statusbar: false,
          toolbar:
            'fontfamily | blocks | ' +
            'bold italic underline strikethrough | forecolor fontsize | hr | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | undo redo | code ',
        }}
      />
      <button type="button" onClick={log}>
        Log editor content
      </button>
    </>
  );
}
