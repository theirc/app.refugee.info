
const cssStyleSheet = `
body, html {
  font-family: Helvetica, Arial, 'sans serif';
  font-size: 100%;
  margin: 5px 5px 5px 5px;
  padding-bottom: 50px;
}

table, td, tr {
  border: 0px white solid;
}

div.table-responsive {
  overflow: auto;
}

div.table-responsive {
  width: 100%;
  overflow: auto;
}

div.table-responsive table {
  border-spacing: 0;
  width: 100%
}

div.table-responsive table td {
  border: 1px white solid;
  padding-left: 5px;
  padding-right: 5px;
}

div.table-responsive table td {
  white-space: nowrap;
}

.rtl {
  direction: rtl;
}

.ltr {
  direction: ltr;
}

a.link-button {
    min-height: 3em;
    line-height: 3em;
    display: block;
    font-size: 100%;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    margin-left: .5em;
    margin-right: .5em;
}

span.tel {
  direction: ltr !important;
  display: inline-block;
  white-space: nowrap;
}
`;

const lightTheme = `
body {
  color: #000;
  background-color: #ffffff;
}

a {
  color: #000;
}

a:active {
  color: #000;
}

a.link-button {
    border: 1px black solid;
    background-color: #ffffff;
    color: #000000 !important;
}

div.table-responsive table td {
  border: 1px black solid;
}
`;

const darkTheme = `
body {
  color: #fff;
  background-color: #000;
}

a {
  color: #fff;
}

a:active {
  color: #fff;
}

a.link-button {
    border: 1px black solid;
    background-color: #000;
    color: #fff !important;
}
`;

export function wrapHtmlContent(content:String, language:String, title:String=null, theme:String="light") : String {
  language = language || 'en';
  let themeCss = (theme || 'light') == 'light' ? lightTheme : darkTheme;
  let titleHtml = title||false ? `<h2>${title}</h2>`:'';
  let direction = ['ar','fa'].indexOf(language) > -1 ? 'rtl' : 'ltr'
  let htmlWrap = `
  <html>
  <head>
  <style>
  ${cssStyleSheet}
  ${themeCss}
  </style>
  </head>
  <body class="${direction}">
  ${titleHtml}
  ${content}
  </body>
  </html>
  `;

  return htmlWrap;
}
