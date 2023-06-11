// import * as FilePond from 'filepond';
// //const FilePond = require('filepond')
// import FilePondPluginImageResize from 'filepond-plugin-image-resize';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
FilePond.registerPlugin(
    FilePondPluginImageResize,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

FilePond.parse(document.body)

// const pond = FilePond.create({
//     multiple: true,
//     name: 'filepond'
// });

// document.body.appendChild(pond.element);
