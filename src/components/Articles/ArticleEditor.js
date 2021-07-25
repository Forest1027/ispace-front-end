import Editor from '@draft-js-plugins/editor';

import createImagePlugin from '@draft-js-plugins/image';
import React from 'react';

const imagePlugin = createImagePlugin();

// The Editor accepts an array of plugins. In this case, only the imagePlugin
// is passed in, although it is possible to pass in multiple plugins.

const ArticleEditor = ({ editorState, onChange }) => {
    return (
        <Editor
            editorState={editorState}
            onChange={onChange}
            plugins={[imagePlugin]}
        />
    );
}

export default ArticleEditor;