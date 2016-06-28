/*!
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2016 ~ Mark Hillard | (mark@)markhillard.com
*/


/*! Table Of Contents:
// ------------------------------
// INITIALIZE CODEMIRROR
// CODE LOADING
// LOCAL STORAGE
// EDITOR UPDATES
// DEPENDENCY INJECTION
// RESIZE FUNCTIONS
// GENERAL FUNCTIONS
// UTILITY FUNCTIONS
// REFRESH EDITOR
// ------------------------------
*/


// make jQuery play nice
var E = $.noConflict(true);

// ready the DOM
E(document).ready(function () {
    
    // INITIALIZE CODEMIRROR
    // ------------------------------
    // html code
    var editorHTML = document.editor = CodeMirror.fromTextArea(htmlcode, {
        mode: 'text/html',
        profile: 'html',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    // emmet support for html
    emmetCodeMirror(editorHTML);
    
    // css code
    var editorCSS = document.editor = CodeMirror.fromTextArea(csscode, {
        mode: 'css',
        profile: 'css',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    // emmet support for css
    emmetCodeMirror(editorCSS);
    
    // js code
    var editorJS = document.editor = CodeMirror.fromTextArea(jscode, {
        mode: 'javascript',
        keyMap: 'sublime',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    
    // CODE LOADING
    // ------------------------------
    var html;
    
    // load html
    function loadHTML() {
        var body = E('#preview').contents().find('body');
        html = editorHTML.getValue();
        body.html(html);
        loadCSS();
    }
    
    // start html
    function startHTML() {
        var iframe = document.getElementById('preview');
        var preview;
        
        if (iframe.contentDocument) {
            preview = iframe.contentDocument;
        } else if (iframe.contentWindow) {
            preview = iframe.contentWindow.document;
        } else {
            preview = iframe.document;
        }
        
        preview.open();
        preview.write(html);
        preview.close();
        loadCSS();
    }
    
    // load css
    function loadCSS() {
        var head = E('#preview').contents().find('head');
        var reset = '<link rel="stylesheet" href="./css/reset.css">';
        var css = editorCSS.getValue();
        head.html(reset + '<style>' + css + '</style>');
    }
    
    // load js
    function loadJS() {
        var iframe = document.getElementById('preview');
        var js = editorJS.getValue();
        var preview;
        
        if (iframe.contentDocument) {
            preview = iframe.contentDocument;
        } else if (iframe.contentWindow) {
            preview = iframe.contentWindow.document;
        } else {
            preview = iframe.document;
        }
        
        preview.open();
        preview.write(html + '<script>' + js + '<\/script>');
        preview.close();
    }
    
    // run start html
    startHTML();
    
    
    // LOCAL STORAGE
    // ------------------------------
    if (localStorage.getItem('htmlcode') === null) {
        var defaultHTML = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>\n<main>\n    <h1>Editor<\/h1>\n    <p>It\'s an editor.<\/p>\n<\/main>';
        localStorage.setItem('htmlcode', defaultHTML);
    }
    
    if (localStorage.getItem('csscode') === null) {
        var defaultCSS = '@import url(\"https:\/\/fonts.googleapis.com\/css?family=Droid+Sans:400,700\");\n\nhtml,body {\n    background-color: #282a36;\n    color: #fff;\n    font-family: \"Droid Sans\", sans-serif;\n    overflow: hidden;\n    text-align: center;\n}\n\nmain {\n    left: 50%;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%,-50%);\n}\n\nh1 {\n    font-size: 10rem;\n    font-weight: 400;\n    margin: 0;\n}\n\np {\n    font-size: 1rem;\n    margin: 1rem 0;\n}';
        localStorage.setItem('csscode', defaultCSS);
    }
    
    if (localStorage.getItem('jscode') === null) {
        var defaultJS = '$(document).ready(function () {\n    $(\'h1\').fadeOut(800).fadeIn(800);\n    $(\'p\').delay(400).fadeOut(800).fadeIn(400);\n});';
        localStorage.setItem('jscode', defaultJS);
    }
    
    // get local storage
    editorHTML.setValue(localStorage.getItem('htmlcode'));
    editorCSS.setValue(localStorage.getItem('csscode'));
    editorJS.setValue(localStorage.getItem('jscode'));
    
    
    // EDITOR UPDATES
    // ------------------------------
    // editor update (html)
    var delayHTML;
    editorHTML.on('change', function () {
        clearTimeout(delayHTML);
        delayHTML = setTimeout(loadHTML, 300);
        localStorage.setItem('htmlcode', editorHTML.getValue());
    });
    
    // editor update (css)
    editorCSS.on('change', function () {
        loadCSS();
        localStorage.setItem('csscode', editorCSS.getValue());
    });
    
    // editor update (js)
    editorJS.on('change', function () {
        localStorage.setItem('jscode', editorJS.getValue());
    });
    
    // run editor update (html)
    loadHTML();
    
    
    // DEPENDENCY INJECTION
    // ------------------------------
    // cdnjs typeahead search
    var typeahead = E('.cdnjs-search .query');
    
    E.get('https://api.cdnjs.com/libraries').done(function (data) {
        var searchData = data.results;
        var search = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: searchData
        });
        
        typeahead.typeahead(null, {
            display: 'name',
            name: 'search',
            source: search,
            limit: 6,
            templates: {
                empty: function () {
                    return '<div class="no-match">unable to match query</div>';
                },
                suggestion: function (data) {
                    return '<p>' + data.name + '</p>';
                }
            }
        }).on('typeahead:select', function (e, datum) {
            var latest = datum.latest;
            loadDep(latest);
            clearSearch();
        }).on('typeahead:change', function () {
            clearSearch();
        });
    }).fail(function () {
        alert("error getting cdnjs libraries");
    });
    
    // clear typeahead search and close results list
    function clearSearch() {
        typeahead.typeahead('val', '');
        typeahead.typeahead('close');
    }
    
    // load dependency
    function loadDep(url) {
        var dep;
        
        if (url.indexOf('<') !== -1) {
            dep = url;
        } else {
            dep = '<script src="' + url + '"><\/script>';
        }
        
        if (html.indexOf(dep) !== -1) {
            alert('dependency already included');
        } else {
            var insert = html.split('<\/script>').length - 1;
            editorHTML.replaceRange(dep + '\n', {
                line: insert,
                ch: 0
            });
            alert('dependency added successfully');
        }
    }
    
    
    // RESIZE FUNCTIONS
    // ------------------------------
    // drag handle to resize code pane
    var resizeHandle = E('.code-pane');
    var widthBox = E('.preview-width');
    var windowWidth = E(window).width();
    
    resizeHandle.resizable({
        handles: 'e',
        minWidth: 0,
        maxWidth: windowWidth - 16,
        create: function () {
            var currentWidth = resizeHandle.width();
            var previewWidth = windowWidth - currentWidth - 16;
            widthBox.text(previewWidth + 'px');
        },
        resize: function (e, ui) {
            var currentWidth = ui.size.width;
            var previewWidth = windowWidth - currentWidth - 16;
            ui.element.next().css('width', windowWidth - currentWidth + 'px');
            ui.element.next().find('iframe').css('pointer-events', 'none');
            widthBox.show();
            if (currentWidth <= 0) {
                widthBox.text(windowWidth - 16 + 'px');
            } else {
                widthBox.text(previewWidth + 'px');
            }
        },
        stop: function (e, ui) {
            ui.element.next().find('iframe').css('pointer-events', 'inherit');
            widthBox.hide();
            editorHTML.refresh();
            editorCSS.refresh();
            editorJS.refresh();
        }
    });
    
    
    // GENERAL FUNCTIONS
    // ------------------------------
    // code pane and wrap button swapping
    function swapOn(elem) {
        elem.css({
            'position': 'relative',
            'visibility': 'visible'
        });
    }
    
    function swapOff(elem) {
        elem.css({
            'position': 'absolute',
            'visibility': 'hidden'
        });
    }
    
    E('.code-swap span').on('click', function () {
        var codeHTML = E('.code-pane-html');
        var codeCSS = E('.code-pane-css');
        var codeJS = E('.code-pane-js');
        var wrapHTML = E('.toggle-lineWrapping.html');
        var wrapCSS = E('.toggle-lineWrapping.css');
        var wrapJS = E('.toggle-lineWrapping.js');
        
        E(this).addClass('active').siblings().removeClass('active');
        
        if (E(this).is(':contains("HTML")')) {
            swapOn(codeHTML);
            swapOn(wrapHTML);
            swapOff(codeCSS);
            swapOff(wrapCSS);
            swapOff(codeJS);
            swapOff(wrapJS);
        } else if (E(this).is(':contains("CSS")')) {
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOn(codeCSS);
            swapOn(wrapCSS);
            swapOff(codeJS);
            swapOff(wrapJS);
        } else if (E(this).is(':contains("JS")')) {
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeCSS);
            swapOff(wrapCSS);
            swapOn(codeJS);
            swapOn(wrapJS);
        }
    });
    
    // expanding scrollbars
    var vScroll = E('.CodeMirror-overlayscroll-vertical');
    var hScroll = E('.CodeMirror-overlayscroll-horizontal');
    
    vScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    hScroll.on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    E(document).on('mouseup', function () {
        vScroll.removeClass('hold');
        hScroll.removeClass('hold');
    });
    
    // indent wrapped lines
    function indentWrappedLines(editor) {
        var charWidth = editor.defaultCharWidth(),
            basePadding = 4;
        editor.on('renderLine', function (cm, line, elt) {
            var off = CodeMirror.countColumn(line.text, null, cm.getOption('tabSize')) * charWidth;
            elt.style.textIndent = '-' + off + 'px';
            elt.style.paddingLeft = (basePadding + off) + 'px';
        });
    }
    
    // run indent wrapped lines
    indentWrappedLines(editorHTML);
    indentWrappedLines(editorCSS);
    indentWrappedLines(editorJS);
    
    
    // UTILITY FUNCTIONS
    // ------------------------------
    // toggle line wrapping (html)
    E('.toggle-lineWrapping.html').on('mousedown', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorHTML.setOption('lineWrapping', true);
            E(this).html('wrap <i class="fa fa-toggle-on"></i>');
        } else {
            editorHTML.setOption('lineWrapping', false);
            E(this).html('wrap <i class="fa fa-toggle-off"></i>');
        }
    });
    
    // toggle line wrapping (css)
    E('.toggle-lineWrapping.css').on('mousedown', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorCSS.setOption('lineWrapping', true);
            E(this).html('wrap <i class="fa fa-toggle-on"></i>');
        } else {
            editorCSS.setOption('lineWrapping', false);
            E(this).html('wrap <i class="fa fa-toggle-off"></i>');
        }
    });
    
    // toggle line wrapping (js)
    E('.toggle-lineWrapping.js').on('mousedown', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorJS.setOption('lineWrapping', true);
            E(this).html('wrap <i class="fa fa-toggle-on"></i>');
        } else {
            editorJS.setOption('lineWrapping', false);
            E(this).html('wrap <i class="fa fa-toggle-off"></i>');
        }
    });
    
    // reset editor
    E('.reset-editor').on('click', function () {
        editorHTML.setValue('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>\n<main>\n    <h1>Editor<\/h1>\n    <p>It\'s an editor.<\/p>\n<\/main>');
        editorCSS.setValue('@import url(\"https:\/\/fonts.googleapis.com\/css?family=Droid+Sans:400,700\");\n\nhtml,body {\n    background-color: #282a36;\n    color: #fff;\n    font-family: \"Droid Sans\", sans-serif;\n    overflow: hidden;\n    text-align: center;\n}\n\nmain {\n    left: 50%;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%,-50%);\n}\n\nh1 {\n    font-size: 10rem;\n    font-weight: 400;\n    margin: 0;\n}\n\np {\n    font-size: 1rem;\n    margin: 1rem 0;\n}');
        editorJS.setValue('$(document).ready(function () {\n    $(\'h1\').fadeOut(800).fadeIn(800);\n    $(\'p\').delay(400).fadeOut(800).fadeIn(400);\n});');
    });
    
    // refresh editor
    E('.refresh-editor').click(function () {
        location.reload();
    });
    
    // clear editor
    E('.clear-editor').on('click', function () {
        editorHTML.setValue('');
        editorCSS.setValue('');
        editorJS.setValue('');
    });
    
    // run script
    E('.run-script').on('click', function () {
        loadJS();
        loadCSS();
        loadHTML();
    });
    
    
    // REFRESH EDITOR
    // ------------------------------
    editorHTML.refresh();
    editorCSS.refresh();
    editorJS.refresh();
    
});
