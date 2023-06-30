// import * as FilePond from 'filepond';
// //const FilePond = require('filepond')
// import FilePondPluginImageResize from 'filepond-plugin-image-resize';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
const rootStyles = window.getComputedStyle(document.documentElement) //Retrieves the CSS file I assume

if (rootStyles.getPropertyValue('--book-cover-width-large') != null && rootStyles.getPropertyValue('--book-cover-width-large') != ''){
    ready()
} else {
    document.getElementById('main.css').addEventListener('load', ready)
}

function ready(){
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })
  
  FilePond.parse(document.body)
}


// const pond = FilePond.create({
//     multiple: true,
//     name: 'filepond'
// });

// document.body.appendChild(pond.element);
