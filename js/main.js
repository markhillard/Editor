/*
███████ ██████  ██ ████████  ██████  ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
█████   ██   ██ ██    ██    ██    ██ ██████
██      ██   ██ ██    ██    ██    ██ ██   ██
███████ ██████  ██    ██     ██████  ██   ██
2016 ~ Mark Hillard | (mark@)markhillard.com
*/


// make jquery play nice
var E = $.noConflict(true);

E(document).ready(function () {
    
    // INITIALIZE CODEMIRROR
    // ------------------------------
    // html code
    var editorHTML = document.editor = CodeMirror.fromTextArea(htmlcode, {
        mode: 'text/html',
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
    
    // css code
    var editorCSS = document.editor = CodeMirror.fromTextArea(csscode, {
        mode: 'css',
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
    // ------------------------------
    // INITIALIZE CODEMIRROR
    
    
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
        var css = editorCSS.getValue();
        var reset = '<link rel="stylesheet" href="http://meyerweb.com/eric/tools/css/reset/reset.css">';
        
        if (E('.get-reset').hasClass('active')) {
            head.html(reset + '<style>' + css + '</style>');
            E('.get-reset').html('css reset &minus;');
        } else {
            head.html('<style>' + css + '</style>');
            E('.get-reset').html('css reset &plus;');
        }
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
    // ------------------------------
    // EDITOR UPDATES
    
    
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
        
        E(typeahead).typeahead(null, {
            display: 'name',
            name: 'search',
            source: search,
            templates: {
                empty: function () {
                    return '<div class="no-match">unable to match query</div>';
                },
                suggestion: function (data) {
                    return '<p>' + data.name + '</p>';
                }
            }
        }).bind('typeahead:select', function (e, datum) {
            var latest = datum.latest;
            loadDep(latest);
            clearSearch();
        }).bind('typeahead:change', function (e, datum) {
            clearSearch();
        });
    }).fail(function () {
        console.log("error getting json data");
    });
    
    // clear typeahead search and close results list
    function clearSearch() {
        E(typeahead).typeahead('val', '');
        E(typeahead).typeahead('close');
    }
    
    // load dependency
    function loadDep(url) {
        var dep;
        
        // if jquery script tags are included
        if (url.indexOf('<') !== -1) {
            dep = url;
        } else {
            dep = '<script src="' + url + '"><\/script>';
        }
        
        // if jquery is already included
        if (html.indexOf(dep) !== -1) {
            alert('dependency already included');
        } else {
            html = dep + '\n' + html;
            editorHTML.setValue(html);
        }
    }
    // ------------------------------
    // DEPENDENCY INJECTION
    
    
    // RESIZE FUNCTIONS
    // ------------------------------
    // window dimensions
    var windowWidth = E(window).width();
    
    // drag handle to resize code pane
    var resizeHandle = E('.code-pane');
    E(resizeHandle).resizable({
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
        E(elem).css({
            'position': 'relative',
            'visibility': 'visible'
        });
    }
    
    function swapOff(elem) {
        E(elem).css({
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
    
    E(vScroll).on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    E(hScroll).on('mousedown', function () {
        E(this).addClass('hold');
    });
    
    E(document).on('mouseup', function () {
        E(vScroll).removeClass('hold');
        E(hScroll).removeClass('hold');
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
    E('.toggle-lineWrapping.html').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorHTML.setOption('lineWrapping', true);
            E(this).html('wrap &#10559;');
        } else {
            editorHTML.setOption('lineWrapping', false);
            E(this).html('wrap &#10558;');
        }
    });
    
    // toggle line wrapping (css)
    E('.toggle-lineWrapping.css').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorCSS.setOption('lineWrapping', true);
            E(this).html('wrap &#10559;');
        } else {
            editorCSS.setOption('lineWrapping', false);
            E(this).html('wrap &#10558;');
        }
    });
    
    // toggle line wrapping (js)
    E('.toggle-lineWrapping.js').on('click', function () {
        E(this).toggleClass('active');
        if (E(this).hasClass('active')) {
            editorJS.setOption('lineWrapping', true);
            E(this).html('wrap &#10559;');
        } else {
            editorJS.setOption('lineWrapping', false);
            E(this).html('wrap &#10558;');
        }
    });
    
    // get css reset
    E('.get-reset').on('click', function () {
        E(this).toggleClass('active');
        loadCSS();
    });
    
    // run script
    E('.run-script').on('click', function () {
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
