/*
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2016 ~ Mark Hillard | (mark@)markhillard.com
*/


$(document).ready(function () {
    // BEGIN INITIALIZE CODEMIRROR
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
    // END INITIALIZE CODEMIRROR
    
    
    // BEGIN CODE LOADING
    // ------------------------------
    // load js
    function loadJS() {
        var body = $('#preview').contents().find('body');
        var js = editorJS.getValue();
        body.html(html + '<script>' + js + '<\/script>');
    }
    
    // load css
    function loadCSS() {
        var head = $('#preview').contents().find('head');
        var css = editorCSS.getValue();
        head.html('<style>' + css + '</style>');
    }
    
    var html;
    
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
        preview.write(editorHTML.getValue());
        preview.close();
        loadCSS();
    }
    
    startHTML();
    // ------------------------------
    // END CODE LOADING
    
    
    // BEGIN LOCAL STORAGE
    // ------------------------------
    if (localStorage.getItem('htmlcode') === null) {
        localStorage.setItem('htmlcode');
    }
    if (localStorage.getItem('csscode') === null) {
        localStorage.setItem('csscode');
    }
    if (localStorage.getItem('jscode') === null) {
        localStorage.setItem('jscode');
    }
    
    // get local storage
    editorHTML.setValue(localStorage.getItem('htmlcode'));
    editorCSS.setValue(localStorage.getItem('csscode'));
    editorJS.setValue(localStorage.getItem('jscode'));
    // ------------------------------
    // END LOCAL STORAGE
    
    
    // BEGIN EDITOR UPDATES
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
    // END EDITOR UPDATES
    
    
    // BEGIN DEPENDENCY INJECTION
    // ------------------------------
    // load jquery
    function loadJQ() {
        var iframe = document.getElementById('preview');
        var preview;
        
        if (iframe.contentDocument) {
            preview = iframe.contentDocument;
        } else if (iframe.contentWindow) {
            preview = iframe.contentWindow.document;
        } else {
            preview = iframe.document;
        }
        
        var jq = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"><\/script>';
        var script = '<html><head>' + jq + '</head><body><\/body><\/html>';
        
        preview.open();
        preview.write(script);
        preview.close();
    }
    // ------------------------------
    // END DEPENDENCY INJECTION
    
    
    // BEGIN RESIZE FUNCTIONS
    // ------------------------------
    // window dimensions
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    // drag handle to resize code pane
    var resizeHandle = $('.code-pane');
    $(resizeHandle).resizable({
        handles: 'e',
        minWidth: 179,
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
    
    // drag handle to resize code pane (html)
    var resizeHandleHTML = $('.code-pane-html');
    $(resizeHandleHTML).resizable({
        containment: ".code-pane",
        handles: 's',
        minHeight: 16,
        maxHeight: windowHeight - 34,
        resize: function (e, ui) {
            var currentHeight = ui.size.height;
            ui.element.siblings('.code-pane-css').css('height', windowHeight - currentHeight - $('.code-pane-js').height() + 'px');
            ui.element.siblings('.code-pane-js').css('height', windowHeight - currentHeight - $('.code-pane-css').height() + 'px');
        },
        stop: function (e, ui) {
            editorHTML.refresh();
            editorCSS.refresh();
            editorJS.refresh();
        }
    });
    
    // drag handle to resize code pane (css)
    var resizeHandleCSS = $('.code-pane-css');
    $(resizeHandleCSS).resizable({
        containment: ".code-pane",
        handles: 's',
        minHeight: 17,
        maxHeight: windowHeight - 33,
        resize: function (e, ui) {
            var currentHeight = ui.size.height;
            ui.element.siblings('.code-pane-js').css('height', windowHeight - currentHeight - $('.code-pane-html').height() + 'px');
            ui.element.siblings('.code-pane-html').css('height', windowHeight - currentHeight - $('.code-pane-js').height() + 'px');
        },
        stop: function (e, ui) {
            editorHTML.refresh();
            editorCSS.refresh();
            editorJS.refresh();
        }
    });
    // ------------------------------
    // END RESIZE FUNCTIONS
    
    
    // BEGIN GENERAL FUNCTIONS
    // ------------------------------
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
        $(vScroll).add(hScroll).removeClass('hold');
    });
    // ------------------------------
    // END GENERAL FUNCTIONS
    
    
    // BEGIN UTILITY FUNCTIONS
    // ------------------------------
    // toggle line wrapping (html)
    $('.toggle-lineWrapping.html').on('click', function () {
        $(this).toggleClass('lw-on');
        if ($(this).hasClass('lw-on')) {
            editorHTML.setOption('lineWrapping', true);
        } else {
            editorHTML.setOption('lineWrapping', false);
        }
    });
    
    // toggle line wrapping (css)
    $('.toggle-lineWrapping.css').on('click', function () {
        $(this).toggleClass('lw-on');
        if ($(this).hasClass('lw-on')) {
            editorCSS.setOption('lineWrapping', true);
        } else {
            editorCSS.setOption('lineWrapping', false);
        }
    });
    
    // toggle line wrapping (js)
    $('.toggle-lineWrapping.js').on('click', function () {
        $(this).toggleClass('lw-on');
        if ($(this).hasClass('lw-on')) {
            editorJS.setOption('lineWrapping', true);
        } else {
            editorJS.setOption('lineWrapping', false);
        }
    });
    
    // run script
    $('.run-script').on('click', function () {
        //loadJQ();
        loadJS();
        loadCSS();
        loadHTML();
    });
    // ------------------------------
    // END UTILITY FUNCTIONS
    
    
    // refresh editor
    editorHTML.refresh();
    editorCSS.refresh();
    editorJS.refresh();
});
