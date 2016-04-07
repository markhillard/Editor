/*
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2016 ~ Mark Hillard | (mark@)markhillard.com
*/


$(document).ready(function () {
    
    // INITIALIZE CODEMIRROR
    // ------------------------------
    // js code
    var editorJS = document.editor = CodeMirror.fromTextArea(jscode, {
        mode: 'javascript',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    // css code
    var editorCSS = document.editor = CodeMirror.fromTextArea(csscode, {
        mode: 'css',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    
    // html code
    var editorHTML = document.editor = CodeMirror.fromTextArea(htmlcode, {
        mode: 'text/html',
        lineNumbers: true,
        lineWrapping: false,
        theme: 'dracula',
        tabSize: 4,
        indentUnit: 4,
        autoCloseBrackets: true,
        scrollbarStyle: 'overlay',
        styleActiveLine: true
    });
    // ------------------------------
    // INITIALIZE CODEMIRROR
    
    
    // CODE LOADING
    // ------------------------------
    var html;
    
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
    
    // load css
    function loadCSS() {
        var head = $('#preview').contents().find('head');
        var css = editorCSS.getValue();
        var reset = '<link rel="stylesheet" href="http://meyerweb.com/eric/tools/css/reset/reset.css">';
        
        if ($('.get-reset').hasClass('active')) {
            head.html(reset + '<style>' + css + '</style>');
            $('.get-reset').html('css reset &minus;');
        } else {
            head.html('<style>' + css + '</style>');
            $('.get-reset').html('css reset &plus;');
        }
    }
    
    // load html
    function loadHTML() {
        var body = $('#preview').contents().find('body');
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
    
    startHTML();
    // ------------------------------
    // CODE LOADING
    
    
    // LOCAL STORAGE
    // ------------------------------
    if (localStorage.getItem('htmlcode') === null) {
        var defaultHTML = '<main>\n    <div>\n        <h1>Editor<\/h1>\n        <p>It\'s an editor.<\/p>\n    <\/div>\n<\/main>';
        localStorage.setItem('htmlcode', defaultHTML);
    }
    if (localStorage.getItem('csscode') === null) {
        var defaultCSS = '@import url(\"https:\/\/fonts.googleapis.com\/css?family=Droid+Sans:400,700\");\n\nbody {\n    background-color:#282a36;\n    color:#fff;\n    font-family:\"Droid Sans\";\n    overflow:hidden;\n    text-align:center;\n}\n\nmain {\n    left:50%;\n    position:absolute;\n    top:50%;\n    transform:translate(-50%,-50%);\n}\n\nh1 {\n    font-size:10rem;\n    font-weight:400;\n    margin:0;\n}\n\np {\n    font-size:1rem;\n    margin:1rem 0;\n}';
        localStorage.setItem('csscode', defaultCSS);
    }
    if (localStorage.getItem('jscode') === null) {
        var defaultJS = 'alert(\'Pow! Right in the kisser.\');';
        localStorage.setItem('jscode', defaultJS);
    }
    
    // get local storage
    editorHTML.setValue(localStorage.getItem('htmlcode'));
    editorCSS.setValue(localStorage.getItem('csscode'));
    editorJS.setValue(localStorage.getItem('jscode'));
    // ------------------------------
    // LOCAL STORAGE
    
    
    // EDITOR UPDATES
    // ------------------------------
    // editor update (js)
    editorJS.on('change', function () {
        localStorage.setItem('jscode', editorJS.getValue());
    });
    
    // editor update (css)
    editorCSS.on('change', function () {
        loadCSS();
        localStorage.setItem('csscode', editorCSS.getValue());
    });
    
    // editor update (html)
    var delayHTML;
    editorHTML.on('change', function () {
        clearTimeout(delayHTML);
        delayHTML = setTimeout(loadHTML, 300);
        localStorage.setItem('htmlcode', editorHTML.getValue());
    });
    
    // run editor update (html)
    loadHTML();
    // ------------------------------
    // EDITOR UPDATES
    
    
    // DEPENDENCY INJECTION
    // ------------------------------
    // load jquery
    function loadJQ(url) {
        var jqDep;
        
        // if jquery script tags are included
        if (url.indexOf('<') !== -1) {
            jqDep = url;
        } else {
            jqDep = '<script src="' + url + '"><\/script>';
        }
        
        // if jquery is already included
        if (html.indexOf(jqDep) !== -1) {
            alert('jquery already included');
        } else {
            html = jqDep + '\n\n' + html;
            editorHTML.setValue(html);
        }
    }
    // ------------------------------
    // DEPENDENCY INJECTION
    
    
    // RESIZE FUNCTIONS
    // ------------------------------
    // window dimensions
    var windowWidth = $(window).width();
    
    // drag handle to resize code pane
    var resizeHandle = $('.code-pane');
    $(resizeHandle).resizable({
        handles: 'e',
        minWidth: 0,
        maxWidth: windowWidth - 16,
        resize: function (e, ui) {
            var currentWidth = ui.size.width;
            ui.element.next().css('width', windowWidth - currentWidth + 'px');
            ui.element.next().find('iframe').css('pointer-events', 'none');
        },
        stop: function (e, ui) {
            ui.element.next().find('iframe').css('pointer-events', 'inherit');
            editorHTML.refresh();
            editorCSS.refresh();
            editorJS.refresh();
        }
    });
    // ------------------------------
    // RESIZE FUNCTIONS
    
    
    // GENERAL FUNCTIONS
    // ------------------------------
    // code pane and wrap button swapping
    function swapOn(elem) {
        $(elem).css({
            'position': 'relative',
            'visibility': 'visible'
        });
    }
    
    function swapOff(elem) {
        $(elem).css({
            'position': 'absolute',
            'visibility': 'hidden'
        });
    }
    
    $('.code-swap span').on('click', function () {
        var codeHTML = $('.code-pane-html');
        var codeCSS = $('.code-pane-css');
        var codeJS = $('.code-pane-js');
        var wrapHTML = $('.toggle-lineWrapping.html');
        var wrapCSS = $('.toggle-lineWrapping.css');
        var wrapJS = $('.toggle-lineWrapping.js');
        
        $(this).addClass('active').siblings().removeClass('active');
        
        if ($(this).is(':contains("HTML")')) {
            swapOn(codeHTML);
            swapOn(wrapHTML);
            swapOff(codeCSS);
            swapOff(wrapCSS);
            swapOff(codeJS);
            swapOff(wrapJS);
        } else if ($(this).is(':contains("CSS")')) {
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOn(codeCSS);
            swapOn(wrapCSS);
            swapOff(codeJS);
            swapOff(wrapJS);
        } else if ($(this).is(':contains("JS")')) {
            swapOff(codeHTML);
            swapOff(wrapHTML);
            swapOff(codeCSS);
            swapOff(wrapCSS);
            swapOn(codeJS);
            swapOn(wrapJS);
        }
    });
    
    // expanding scrollbars
    var vScroll = $('.CodeMirror-overlayscroll-vertical');
    var hScroll = $('.CodeMirror-overlayscroll-horizontal');
    
    $(vScroll).on('mousedown', function () {
        $(this).addClass('hold');
    });
    
    $(hScroll).on('mousedown', function () {
        $(this).addClass('hold');
    });
    
    $(document).on('mouseup', function () {
        $(vScroll).removeClass('hold');
        $(hScroll).removeClass('hold');
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
    // ------------------------------
    // GENERAL FUNCTIONS
    
    
    // UTILITY FUNCTIONS
    // ------------------------------
    // toggle line wrapping (html)
    $('.toggle-lineWrapping.html').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            editorHTML.setOption('lineWrapping', true);
            $(this).html('wrap &vdash;');
        } else {
            editorHTML.setOption('lineWrapping', false);
            $(this).html('wrap &dashv;');
        }
    });
    
    // toggle line wrapping (css)
    $('.toggle-lineWrapping.css').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            editorCSS.setOption('lineWrapping', true);
            $(this).html('wrap &vdash;');
        } else {
            editorCSS.setOption('lineWrapping', false);
            $(this).html('wrap &dashv;');
        }
    });
    
    // toggle line wrapping (js)
    $('.toggle-lineWrapping.js').on('click', function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            editorJS.setOption('lineWrapping', true);
            $(this).html('wrap &vdash;');
        } else {
            editorJS.setOption('lineWrapping', false);
            $(this).html('wrap &dashv;');
        }
    });
    
    // get jquery
    $('.get-jq').on('click', function () {
        loadJQ('http://code.jquery.com/jquery-latest.min.js');
    });
    
    // get css reset
    $('.get-reset').on('click', function () {
        $(this).toggleClass('active');
        loadCSS();
    });
    
    // run script
    $('.run-script').on('click', function () {
        loadJS();
        loadCSS();
        loadHTML();
    });
    // ------------------------------
    // UTILITY FUNCTIONS
    
    
    // refresh editor
    editorHTML.refresh();
    editorCSS.refresh();
    editorJS.refresh();
    
});
