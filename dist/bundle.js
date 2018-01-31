(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('backbone'), require('underscore')) :
	typeof define === 'function' && define.amd ? define(['backbone', 'underscore'], factory) :
	(global.ThresholdEditor = factory(global.Backbone,global._));
}(this, (function (backbone,_) { 'use strict';

_ = _ && _.hasOwnProperty('default') ? _['default'] : _;

var nativeIsArray = Array.isArray;
var toString = Object.prototype.toString;

var xIsArray = nativeIsArray || isArray;

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

var version = "2";

var isVnode = isVirtualNode;

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

var isWidget_1 = isWidget;

function isWidget(w) {
    return w && w.type === "Widget"
}

var isThunk_1 = isThunk;

function isThunk(t) {
    return t && t.type === "Thunk"
}

var isVhook = isHook;

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

var vnode = VirtualNode;

var noProperties = {};
var noChildren = [];

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName;
    this.properties = properties || noProperties;
    this.children = children || noChildren;
    this.key = key != null ? String(key) : undefined;
    this.namespace = (typeof namespace === "string") ? namespace : null;

    var count = (children && children.length) || 0;
    var descendants = 0;
    var hasWidgets = false;
    var hasThunks = false;
    var descendantHooks = false;
    var hooks;

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName];
            if (isVhook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {};
                }

                hooks[propName] = property;
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i];
        if (isVnode(child)) {
            descendants += child.count || 0;

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true;
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true;
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true;
            }
        } else if (!hasWidgets && isWidget_1(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true;
            }
        } else if (!hasThunks && isThunk_1(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants;
    this.hasWidgets = hasWidgets;
    this.hasThunks = hasThunks;
    this.hooks = hooks;
    this.descendantHooks = descendantHooks;
}

VirtualNode.prototype.version = version;
VirtualNode.prototype.type = "VirtualNode";

var vtext = VirtualText;

function VirtualText(text) {
    this.text = String(text);
}

VirtualText.prototype.version = version;
VirtualText.prototype.type = "VirtualText";

var isVtext = isVirtualText;

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
var browserSplit = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

var parseTag_1 = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = browserSplit(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

var softSetHook = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var root = typeof window !== 'undefined' ?
    window : typeof commonjsGlobal !== 'undefined' ?
    commonjsGlobal : {};

var individual = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

var oneVersion = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return individual(key, defaultValue);
}

var MY_VERSION = '7';
oneVersion('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

var evStore = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

var evHook = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = evStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = evStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

var virtualHyperscript = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag_1(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isVhook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new vnode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new vtext(c));
    } else if (typeof c === 'number') {
        childNodes.push(new vtext(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (xIsArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isVhook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVnode(x) || isVtext(x) || isWidget_1(x) || isThunk_1(x);
}

function isChildren(x) {
    return typeof x === 'string' || xIsArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode);
        err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

var h_1 = virtualHyperscript;

var slice = Array.prototype.slice;

var domWalk = iterativelyWalk;

function iterativelyWalk(nodes, cb) {
    if (!('length' in nodes)) {
        nodes = [nodes];
    }

    nodes = slice.call(nodes);

    while(nodes.length) {
        var node = nodes.shift(),
            ret = cb(node);

        if (ret) {
            return ret
        }

        if (node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes);
        }
    }
}

var domComment = Comment;

function Comment(data, owner) {
    if (!(this instanceof Comment)) {
        return new Comment(data, owner)
    }

    this.data = data;
    this.nodeValue = data;
    this.length = data.length;
    this.ownerDocument = owner || null;
}

Comment.prototype.nodeType = 8;
Comment.prototype.nodeName = "#comment";

Comment.prototype.toString = function _Comment_toString() {
    return "[object Comment]"
};

var domText = DOMText;

function DOMText(value, owner) {
    if (!(this instanceof DOMText)) {
        return new DOMText(value)
    }

    this.data = value || "";
    this.length = this.data.length;
    this.ownerDocument = owner || null;
}

DOMText.prototype.type = "DOMTextNode";
DOMText.prototype.nodeType = 3;
DOMText.prototype.nodeName = "#text";

DOMText.prototype.toString = function _Text_toString() {
    return this.data
};

DOMText.prototype.replaceData = function replaceData(index, length, value) {
    var current = this.data;
    var left = current.substring(0, index);
    var right = current.substring(index + length, current.length);
    this.data = left + value + right;
    this.length = this.data.length;
};

var dispatchEvent_1 = dispatchEvent;

function dispatchEvent(ev) {
    var elem = this;
    var type = ev.type;

    if (!ev.target) {
        ev.target = elem;
    }

    if (!elem.listeners) {
        elem.listeners = {};
    }

    var listeners = elem.listeners[type];

    if (listeners) {
        return listeners.forEach(function (listener) {
            ev.currentTarget = elem;
            if (typeof listener === 'function') {
                listener(ev);
            } else {
                listener.handleEvent(ev);
            }
        })
    }

    if (elem.parentNode) {
        elem.parentNode.dispatchEvent(ev);
    }
}

var addEventListener_1 = addEventListener;

function addEventListener(type, listener) {
    var elem = this;

    if (!elem.listeners) {
        elem.listeners = {};
    }

    if (!elem.listeners[type]) {
        elem.listeners[type] = [];
    }

    if (elem.listeners[type].indexOf(listener) === -1) {
        elem.listeners[type].push(listener);
    }
}

var removeEventListener_1 = removeEventListener;

function removeEventListener(type, listener) {
    var elem = this;

    if (!elem.listeners) {
        return
    }

    if (!elem.listeners[type]) {
        return
    }

    var list = elem.listeners[type];
    var index = list.indexOf(listener);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

var serialize = serializeNode;

var voidElements = ["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];

function serializeNode(node) {
    switch (node.nodeType) {
        case 3:
            return escapeText(node.data)
        case 8:
            return "<!--" + node.data + "-->"
        default:
            return serializeElement(node)
    }
}

function serializeElement(elem) {
    var strings = [];

    var tagname = elem.tagName;

    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
        tagname = tagname.toLowerCase();
    }

    strings.push("<" + tagname + properties(elem) + datasetify(elem));

    if (voidElements.indexOf(tagname) > -1) {
        strings.push(" />");
    } else {
        strings.push(">");

        if (elem.childNodes.length) {
            strings.push.apply(strings, elem.childNodes.map(serializeNode));
        } else if (elem.textContent || elem.innerText) {
            strings.push(escapeText(elem.textContent || elem.innerText));
        } else if (elem.innerHTML) {
            strings.push(elem.innerHTML);
        }

        strings.push("</" + tagname + ">");
    }

    return strings.join("")
}

function isProperty(elem, key) {
    var type = typeof elem[key];

    if (key === "style" && Object.keys(elem.style).length > 0) {
      return true
    }

    return elem.hasOwnProperty(key) &&
        (type === "string" || type === "boolean" || type === "number") &&
        key !== "nodeName" && key !== "className" && key !== "tagName" &&
        key !== "textContent" && key !== "innerText" && key !== "namespaceURI" &&  key !== "innerHTML"
}

function stylify(styles) {
    if (typeof styles === 'string') return styles
    var attr = "";
    Object.keys(styles).forEach(function (key) {
        var value = styles[key];
        key = key.replace(/[A-Z]/g, function(c) {
            return "-" + c.toLowerCase();
        });
        attr += key + ":" + value + ";";
    });
    return attr
}

function datasetify(elem) {
    var ds = elem.dataset;
    var props = [];

    for (var key in ds) {
        props.push({ name: "data-" + key, value: ds[key] });
    }

    return props.length ? stringify(props) : ""
}

function stringify(list) {
    var attributes = [];
    list.forEach(function (tuple) {
        var name = tuple.name;
        var value = tuple.value;

        if (name === "style") {
            value = stylify(value);
        }

        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"");
    });

    return attributes.length ? " " + attributes.join(" ") : ""
}

function properties(elem) {
    var props = [];
    for (var key in elem) {
        if (isProperty(elem, key)) {
            props.push({ name: key, value: elem[key] });
        }
    }

    for (var ns in elem._attributes) {
      for (var attribute in elem._attributes[ns]) {
        var prop = elem._attributes[ns][attribute];
        var name = (prop.prefix ? prop.prefix + ":" : "") + attribute;
        props.push({ name: name, value: prop.value });
      }
    }

    if (elem.className) {
        props.push({ name: "class", value: elem.className });
    }

    return props.length ? stringify(props) : ""
}

function escapeText(s) {
    var str = '';

    if (typeof(s) === 'string') {
        str = s;
    } else if (s) {
        str = s.toString();
    }

    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

function escapeAttributeValue(str) {
    return escapeText(str).replace(/"/g, "&quot;")
}

var htmlns = "http://www.w3.org/1999/xhtml";

var domElement = DOMElement;

function DOMElement(tagName, owner, namespace) {
    if (!(this instanceof DOMElement)) {
        return new DOMElement(tagName)
    }

    var ns = namespace === undefined ? htmlns : (namespace || null);

    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName;
    this.nodeName = this.tagName;
    this.className = "";
    this.dataset = {};
    this.childNodes = [];
    this.parentNode = null;
    this.style = {};
    this.ownerDocument = owner || null;
    this.namespaceURI = ns;
    this._attributes = {};

    if (this.tagName === 'INPUT') {
      this.type = 'text';
    }
}

DOMElement.prototype.type = "DOMElement";
DOMElement.prototype.nodeType = 1;

DOMElement.prototype.appendChild = function _Element_appendChild(child) {
    if (child.parentNode) {
        child.parentNode.removeChild(child);
    }

    this.childNodes.push(child);
    child.parentNode = this;

    return child
};

DOMElement.prototype.replaceChild =
    function _Element_replaceChild(elem, needle) {
        // TODO: Throw NotFoundError if needle.parentNode !== this

        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }

        var index = this.childNodes.indexOf(needle);

        needle.parentNode = null;
        this.childNodes[index] = elem;
        elem.parentNode = this;

        return needle
    };

DOMElement.prototype.removeChild = function _Element_removeChild(elem) {
    // TODO: Throw NotFoundError if elem.parentNode !== this

    var index = this.childNodes.indexOf(elem);
    this.childNodes.splice(index, 1);

    elem.parentNode = null;
    return elem
};

DOMElement.prototype.insertBefore =
    function _Element_insertBefore(elem, needle) {
        // TODO: Throw NotFoundError if referenceElement is a dom node
        // and parentNode !== this

        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }

        var index = needle === null || needle === undefined ?
            -1 :
            this.childNodes.indexOf(needle);

        if (index > -1) {
            this.childNodes.splice(index, 0, elem);
        } else {
            this.childNodes.push(elem);
        }

        elem.parentNode = this;
        return elem
    };

DOMElement.prototype.setAttributeNS =
    function _Element_setAttributeNS(namespace, name, value) {
        var prefix = null;
        var localName = name;
        var colonPosition = name.indexOf(":");
        if (colonPosition > -1) {
            prefix = name.substr(0, colonPosition);
            localName = name.substr(colonPosition + 1);
        }
        if (this.tagName === 'INPUT' && name === 'type') {
          this.type = value;
        }
        else {
          var attributes = this._attributes[namespace] || (this._attributes[namespace] = {});
          attributes[localName] = {value: value, prefix: prefix};
        }
    };

DOMElement.prototype.getAttributeNS =
    function _Element_getAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        var value = attributes && attributes[name] && attributes[name].value;
        if (this.tagName === 'INPUT' && name === 'type') {
          return this.type;
        }
        if (typeof value !== "string") {
            return null
        }
        return value
    };

DOMElement.prototype.removeAttributeNS =
    function _Element_removeAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        if (attributes) {
            delete attributes[name];
        }
    };

DOMElement.prototype.hasAttributeNS =
    function _Element_hasAttributeNS(namespace, name) {
        var attributes = this._attributes[namespace];
        return !!attributes && name in attributes;
    };

DOMElement.prototype.setAttribute = function _Element_setAttribute(name, value) {
    return this.setAttributeNS(null, name, value)
};

DOMElement.prototype.getAttribute = function _Element_getAttribute(name) {
    return this.getAttributeNS(null, name)
};

DOMElement.prototype.removeAttribute = function _Element_removeAttribute(name) {
    return this.removeAttributeNS(null, name)
};

DOMElement.prototype.hasAttribute = function _Element_hasAttribute(name) {
    return this.hasAttributeNS(null, name)
};

DOMElement.prototype.removeEventListener = removeEventListener_1;
DOMElement.prototype.addEventListener = addEventListener_1;
DOMElement.prototype.dispatchEvent = dispatchEvent_1;

// Un-implemented
DOMElement.prototype.focus = function _Element_focus() {
    return void 0
};

DOMElement.prototype.toString = function _Element_toString() {
    return serialize(this)
};

DOMElement.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
    var classes = classNames.split(" ");
    var elems = [];

    domWalk(this, function (node) {
        if (node.nodeType === 1) {
            var nodeClassName = node.className || "";
            var nodeClasses = nodeClassName.split(" ");

            if (classes.every(function (item) {
                return nodeClasses.indexOf(item) !== -1
            })) {
                elems.push(node);
            }
        }
    });

    return elems
};

DOMElement.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
    tagName = tagName.toLowerCase();
    var elems = [];

    domWalk(this.childNodes, function (node) {
        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
            elems.push(node);
        }
    });

    return elems
};

DOMElement.prototype.contains = function _Element_contains(element) {
    return domWalk(this, function (node) {
        return element === node
    }) || false
};

var domFragment = DocumentFragment;

function DocumentFragment(owner) {
    if (!(this instanceof DocumentFragment)) {
        return new DocumentFragment()
    }

    this.childNodes = [];
    this.parentNode = null;
    this.ownerDocument = owner || null;
}

DocumentFragment.prototype.type = "DocumentFragment";
DocumentFragment.prototype.nodeType = 11;
DocumentFragment.prototype.nodeName = "#document-fragment";

DocumentFragment.prototype.appendChild  = domElement.prototype.appendChild;
DocumentFragment.prototype.replaceChild = domElement.prototype.replaceChild;
DocumentFragment.prototype.removeChild  = domElement.prototype.removeChild;

DocumentFragment.prototype.toString =
    function _DocumentFragment_toString() {
        return this.childNodes.map(function (node) {
            return String(node)
        }).join("")
    };

var event = Event;

function Event(family) {}

Event.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
};

Event.prototype.preventDefault = function _Event_preventDefault() {

};

var document$1 = Document;

function Document() {
    if (!(this instanceof Document)) {
        return new Document();
    }

    this.head = this.createElement("head");
    this.body = this.createElement("body");
    this.documentElement = this.createElement("html");
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.childNodes = [this.documentElement];
    this.nodeType = 9;
}

var proto = Document.prototype;
proto.createTextNode = function createTextNode(value) {
    return new domText(value, this)
};

proto.createElementNS = function createElementNS(namespace, tagName) {
    var ns = namespace === null ? null : String(namespace);
    return new domElement(tagName, this, ns)
};

proto.createElement = function createElement(tagName) {
    return new domElement(tagName, this)
};

proto.createDocumentFragment = function createDocumentFragment() {
    return new domFragment(this)
};

proto.createEvent = function createEvent(family) {
    return new event(family)
};

proto.createComment = function createComment(data) {
    return new domComment(data, this)
};

proto.getElementById = function getElementById(id) {
    id = String(id);

    var result = domWalk(this.childNodes, function (node) {
        if (String(node.id) === id) {
            return node
        }
    });

    return result || null
};

proto.getElementsByClassName = domElement.prototype.getElementsByClassName;
proto.getElementsByTagName = domElement.prototype.getElementsByTagName;
proto.contains = domElement.prototype.contains;

proto.removeEventListener = removeEventListener_1;
proto.addEventListener = addEventListener_1;
proto.dispatchEvent = dispatchEvent_1;

var minDocument = new document$1();

var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
    typeof window !== 'undefined' ? window : {};


var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDocument;
    }
}

var document_1 = doccy;

var isObject = function isObject(x) {
	return typeof x === "object" && x !== null;
};

var applyProperties_1 = applyProperties;

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName];

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isVhook(propValue)) {
            removeProperty(node, propName, propValue, previous);
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined);
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue;
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName];

        if (!isVhook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName);
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = "";
                }
            } else if (typeof previousValue === "string") {
                node[propName] = "";
            } else {
                node[propName] = null;
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue);
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined;

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName];

            if (attrValue === undefined) {
                node.removeAttribute(attrName);
            } else {
                node.setAttribute(attrName, attrValue);
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue;
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {};
    }

    var replacer = propName === "style" ? "" : undefined;

    for (var k in propValue) {
        var value = propValue[k];
        node[propName][k] = (value === undefined) ? replacer : value;
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

var handleThunk_1 = handleThunk;

function handleThunk(a, b) {
    var renderedA = a;
    var renderedB = b;

    if (isThunk_1(b)) {
        renderedB = renderThunk(b, a);
    }

    if (isThunk_1(a)) {
        renderedA = renderThunk(a, null);
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode;

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous);
    }

    if (!(isVnode(renderedThunk) ||
            isVtext(renderedThunk) ||
            isWidget_1(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

var createElement_1 = createElement;

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document_1 : document_1;
    var warn = opts ? opts.warn : null;

    vnode = handleThunk_1(vnode).a;

    if (isWidget_1(vnode)) {
        return vnode.init()
    } else if (isVtext(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVnode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode);
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName);

    var props = vnode.properties;
    applyProperties_1(node, props);

    var children = vnode.children;

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts);
        if (childNode) {
            node.appendChild(childNode);
        }
    }

    return node
}

var createElement_1$2 = createElement_1;

VirtualPatch.NONE = 0;
VirtualPatch.VTEXT = 1;
VirtualPatch.VNODE = 2;
VirtualPatch.WIDGET = 3;
VirtualPatch.PROPS = 4;
VirtualPatch.ORDER = 5;
VirtualPatch.INSERT = 6;
VirtualPatch.REMOVE = 7;
VirtualPatch.THUNK = 8;

var vpatch = VirtualPatch;

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type);
    this.vNode = vNode;
    this.patch = patch;
}

VirtualPatch.prototype.version = version;
VirtualPatch.prototype.type = "VirtualPatch";

var diffProps_1 = diffProps;

function diffProps(a, b) {
    var diff;

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {};
            diff[aKey] = undefined;
        }

        var aValue = a[aKey];
        var bValue = b[aKey];

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype$1(bValue) !== getPrototype$1(aValue)) {
                diff = diff || {};
                diff[aKey] = bValue;
            } else if (isVhook(bValue)) {
                 diff = diff || {};
                 diff[aKey] = bValue;
            } else {
                var objectDiff = diffProps(aValue, bValue);
                if (objectDiff) {
                    diff = diff || {};
                    diff[aKey] = objectDiff;
                }
            }
        } else {
            diff = diff || {};
            diff[aKey] = bValue;
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {};
            diff[bKey] = b[bKey];
        }
    }

    return diff
}

function getPrototype$1(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

var diff_1 = diff;

function diff(a, b) {
    var patch = { a: a };
    walk(a, b, patch, 0);
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index];
    var applyClear = false;

    if (isThunk_1(a) || isThunk_1(b)) {
        thunks(a, b, patch, index);
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget_1(a)) {
            clearState(a, patch, index);
            apply = patch[index];
        }

        apply = appendPatch(apply, new vpatch(vpatch.REMOVE, a, b));
    } else if (isVnode(b)) {
        if (isVnode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps_1(a.properties, b.properties);
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new vpatch(vpatch.PROPS, a, propsPatch));
                }
                apply = diffChildren(a, b, patch, apply, index);
            } else {
                apply = appendPatch(apply, new vpatch(vpatch.VNODE, a, b));
                applyClear = true;
            }
        } else {
            apply = appendPatch(apply, new vpatch(vpatch.VNODE, a, b));
            applyClear = true;
        }
    } else if (isVtext(b)) {
        if (!isVtext(a)) {
            apply = appendPatch(apply, new vpatch(vpatch.VTEXT, a, b));
            applyClear = true;
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new vpatch(vpatch.VTEXT, a, b));
        }
    } else if (isWidget_1(b)) {
        if (!isWidget_1(a)) {
            applyClear = true;
        }

        apply = appendPatch(apply, new vpatch(vpatch.WIDGET, a, b));
    }

    if (apply) {
        patch[index] = apply;
    }

    if (applyClear) {
        clearState(a, patch, index);
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children;
    var orderedSet = reorder(aChildren, b.children);
    var bChildren = orderedSet.children;

    var aLen = aChildren.length;
    var bLen = bChildren.length;
    var len = aLen > bLen ? aLen : bLen;

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i];
        var rightNode = bChildren[i];
        index += 1;

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new vpatch(vpatch.INSERT, null, rightNode));
            }
        } else {
            walk(leftNode, rightNode, patch, index);
        }

        if (isVnode(leftNode) && leftNode.count) {
            index += leftNode.count;
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new vpatch(
            vpatch.ORDER,
            a,
            orderedSet.moves
        ));
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index);
    destroyWidgets(vNode, patch, index);
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget_1(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new vpatch(vpatch.REMOVE, vNode, null)
            );
        }
    } else if (isVnode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            var child = children[i];
            index += 1;

            destroyWidgets(child, patch, index);

            if (isVnode(child) && child.count) {
                index += child.count;
            }
        }
    } else if (isThunk_1(vNode)) {
        thunks(vNode, null, patch, index);
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk_1(a, b);
    var thunkPatch = diff(nodes.a, nodes.b);
    if (hasPatches(thunkPatch)) {
        patch[index] = new vpatch(vpatch.THUNK, null, thunkPatch);
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVnode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new vpatch(
                    vpatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            );
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children;
            var len = children.length;
            for (var i = 0; i < len; i++) {
                var child = children[i];
                index += 1;

                unhook(child, patch, index);

                if (isVnode(child) && child.count) {
                    index += child.count;
                }
            }
        }
    } else if (isThunk_1(vNode)) {
        thunks(vNode, null, patch, index);
    }
}

function undefinedKeys(obj) {
    var result = {};

    for (var key in obj) {
        result[key] = undefined;
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren);
    var bKeys = bChildIndex.keys;
    var bFree = bChildIndex.free;

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren);
    var aKeys = aChildIndex.keys;
    var aFree = aChildIndex.free;

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = [];

    var freeIndex = 0;
    var freeCount = bFree.length;
    var deletedItems = 0;

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i];
        var itemIndex;

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key];
                newChildren.push(bChildren[itemIndex]);

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++];
                newChildren.push(bChildren[itemIndex]);
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++;
                newChildren.push(null);
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex];

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j];

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem);
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem);
        }
    }

    var simulate = newChildren.slice();
    var simulateIndex = 0;
    var removes = [];
    var inserts = [];
    var simulateItem;

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k];
        simulateItem = simulate[simulateIndex];

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null));
            simulateItem = simulate[simulateIndex];
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key));
                        simulateItem = simulate[simulateIndex];
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k});
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++;
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k});
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k});
                }
                k++;
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key));
            }
        }
        else {
            simulateIndex++;
            k++;
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex];
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key));
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1);

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {};
    var free = [];
    var length = children.length;

    for (var i = 0; i < length; i++) {
        var child = children[i];

        if (child.key) {
            keys[child.key] = i;
        } else {
            free.push(i);
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (xIsArray(apply)) {
            apply.push(patch);
        } else {
            apply = [apply, patch];
        }

        return apply
    } else {
        return patch
    }
}

var diff_1$2 = diff_1;

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {};

var domIndex_1 = domIndex;

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending);
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {};


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode;
        }

        var vChildren = tree.children;

        if (vChildren) {

            var childNodes = rootNode.childNodes;

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1;

                var vChild = vChildren[i] || noChild;
                var nextIndex = rootIndex + (vChild.count || 0);

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex);
                }

                rootIndex = nextIndex;
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0;
    var maxIndex = indices.length - 1;
    var currentIndex;
    var currentItem;

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0;
        currentItem = indices[currentIndex];

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1;
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1;
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

var updateWidget_1 = updateWidget;

function updateWidget(a, b) {
    if (isWidget_1(a) && isWidget_1(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

var patchOp = applyPatch;

function applyPatch(vpatch$$1, domNode, renderOptions) {
    var type = vpatch$$1.type;
    var vNode = vpatch$$1.vNode;
    var patch = vpatch$$1.patch;

    switch (type) {
        case vpatch.REMOVE:
            return removeNode(domNode, vNode)
        case vpatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case vpatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case vpatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case vpatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case vpatch.ORDER:
            reorderChildren(domNode, patch);
            return domNode
        case vpatch.PROPS:
            applyProperties_1(domNode, patch, vNode.properties);
            return domNode
        case vpatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode;

    if (parentNode) {
        parentNode.removeChild(domNode);
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode) {
        parentNode.appendChild(newNode);
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode;

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode;
    } else {
        var parentNode = domNode.parentNode;
        newNode = renderOptions.render(vText, renderOptions);

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode);
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget_1(leftVNode, widget);
    var newNode;

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode;
    } else {
        newNode = renderOptions.render(widget, renderOptions);
    }

    var parentNode = domNode.parentNode;

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode);
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode;
    var newNode = renderOptions.render(vNode, renderOptions);

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode);
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget_1(w)) {
        w.destroy(domNode);
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes;
    var keyMap = {};
    var node;
    var remove;
    var insert;

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i];
        node = childNodes[remove.from];
        if (remove.key) {
            keyMap[remove.key] = node;
        }
        domNode.removeChild(node);
    }

    var length = childNodes.length;
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j];
        node = keyMap[insert.key];
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to]);
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot);
    }

    return newRoot;
}

var patch_1 = patch;

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {};
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive;
    renderOptions.render = renderOptions.render || createElement_1;

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches);

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex_1(rootNode, patches.a, indices);
    var ownerDocument = rootNode.ownerDocument;

    if (!renderOptions.document && ownerDocument !== document_1) {
        renderOptions.document = ownerDocument;
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i];
        rootNode = applyPatch$1(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions);
    }

    return rootNode
}

function applyPatch$1(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode;

    if (xIsArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions);

            if (domNode === rootNode) {
                rootNode = newNode;
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions);

        if (domNode === rootNode) {
            rootNode = newNode;
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = [];

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key));
        }
    }

    return indices
}

var patch_1$2 = patch_1;

var ViewModel = backbone.View.extend({
  // virtual tree
  tree: null,
  // real dom
  treeNode: null,
  timer: null,
  components: {},
  // virtual render,
  tpl: function tpl() {},
  initializeRender: function initializeRender() {
    this.tree = this.tpl(this);
    this.treeNode = createElement_1$2(this.tree);
    return this.updateRender;
  },
  updateRender: function updateRender() {
    var _this = this;

    clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      var newTree = _this.tpl(_this);
      var patches = diff_1$2(_this.tree, newTree);
      _this.treeNode = patch_1$2(_this.treeNode, patches);
      _this.tree = newTree;
    }, 0);
  },
  triggerRender: function triggerRender() {
    this.triggerRender = this.initializeRender();
    this.$el.replaceWith(this.treeNode);
  },
  render: function render() {
    this.triggerRender();
  }
});

var regex = /^([\d\.]*)\s*([\d\.]*)\s*([\d\.]*)$/;
var rules = /\((\d{2}:\d{2}\s*\d{2}:\d{2})\)\s*([><=])\s*(\d*\s*\d*\s*\d*)|(\s*)([><=])\s*(\d*\s*\d*\s*\d*)/;
var analysis = function analysis(str) {
  var mathes = rules.exec(str);
  var time = mathes[1] || mathes[4];
  var times = time.split(" ");
  var operator = mathes[2] || mathes[5];
  var threshold = mathes[3] || mathes[6];
  return new Threshold({
    from: times.length == 2 ? times[0] : "",
    to: times.length == 2 ? times[1] : "",
    operator: operator,
    threshold: threshold
  });
};
var Threshold = backbone.Model.extend({
  defaults: {
    from: "",
    to: "",
    operator: ">",
    threshold: "",
    editing: false
  },
  getIsAcrossTheDay: function getIsAcrossTheDay() {
    return ~~this.get("from").split(":")[0] > ~~this.get("to").split(":")[0];
  },
  getFrom: function getFrom() {
    return this.get("from").split(":")[0];
  },
  getTo: function getTo() {
    return this.get("to").split(":")[0];
  },
  getThreshold: function getThreshold() {
    var l = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

    var res = regex.exec(this.get("threshold"));
    return res.slice(1, 1 + l);
  },
  setFirst: function setFirst(val) {
    var res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, function (o, i) {
      if (i < 1 && o === "") {
        res[i] = val;
      }
    });
    res[0] = val;
    this.set("threshold", res.join(" "));
  },
  setSecond: function setSecond(val) {
    var res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, function (o, i) {
      if (i < 1 && o === "") {
        res[i] = val;
      }
    });
    res[1] = val;
    this.set("threshold", res.join(" "));
  },
  setThree: function setThree(val) {
    var res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, function (o, i) {
      if (i < 2 && o === "") {
        res[i] = val;
      }
    });
    res[2] = val;
    this.set("threshold", res.join(" "));
  },
  isallday: function isallday() {
    return this.getFrom() === "" && this.getTo() === "";
  }
});

function Component (Constructor) {
  return function (option) {
    var components = option.components,
        instanceName = option.instanceName,
        props = option.props,
        state = option.state,
        parentState = option.parentState;

    var instance = null;
    if (!(instance = components[instanceName])) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      instance = components[instanceName] = new (Function.prototype.bind.apply(Constructor, [null].concat([option], args)))();
    }
    return instance.tpl(props || {}, state || {}, parentState);
  };
}

var colors = ["purple", "light-blue", "green", "blue", "magenta", "bright-green"];

var callable;
var byObserver;

callable = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

byObserver = function (Observer) {
	var node = document.createTextNode(''), queue, currentQueue, i = 0;
	new Observer(function () {
		var callback;
		if (!queue) {
			if (!currentQueue) return;
			queue = currentQueue;
		} else if (currentQueue) {
			queue = currentQueue.concat(queue);
		}
		currentQueue = queue;
		queue = null;
		if (typeof currentQueue === 'function') {
			callback = currentQueue;
			currentQueue = null;
			callback();
			return;
		}
		node.data = (i = ++i % 2); // Invoke other batch, to handle leftover callbacks in case of crash
		while (currentQueue) {
			callback = currentQueue.shift();
			if (!currentQueue.length) currentQueue = null;
			callback();
		}
	}).observe(node, { characterData: true });
	return function (fn) {
		callable(fn);
		if (queue) {
			if (typeof queue === 'function') queue = [queue, fn];
			else queue.push(fn);
			return;
		}
		queue = fn;
		node.data = (i = ++i % 2);
	};
};

var nextTick = (function () {
	// Node.js
	if ((typeof process === 'object') && process && (typeof process.nextTick === 'function')) {
		return process.nextTick;
	}

	// MutationObserver
	if ((typeof document === 'object') && document) {
		if (typeof MutationObserver === 'function') return byObserver(MutationObserver);
		if (typeof WebKitMutationObserver === 'function') return byObserver(WebKitMutationObserver);
	}

	// W3C Draft
	// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
	if (typeof setImmediate === 'function') {
		return function (cb) { setImmediate(callable(cb)); };
	}

	// Wide available standard
	if ((typeof setTimeout === 'function') || (typeof setTimeout === 'object')) {
		return function (cb) { setTimeout(callable(cb), 0); };
	}

	return null;
}());

function AsyncValHook(value) {
  if (!(this instanceof AsyncValHook)) {
    return new AsyncValHook(value);
  }
  this.value = value;
}

AsyncValHook.prototype.hook = function (node) {
  var _this = this;

  nextTick(function () {
    node.value = _this.value;
  });
};

AsyncValHook.prototype.unhook = function (node) {
  node.value = "";
};

AsyncValHook.prototype.type = 'AsyncValHook';

var TimeConstructor = ViewModel.extend({
  tpl: function tpl(props, state, parentState) {
    var _this = this;

    var isallday = this.model.isallday();
    return h_1('span', null, [h_1('div', { className: "threshold-editor__col-2 threshold-editor__list--occupy-container" }, [h_1('div', {
      className: isallday ? "threshold-editor__list--occupy is-allday" : "threshold-editor__list--occupy"

    }, [h_1('div', { className: "threshold-editor__row" }, [h_1('div', {
      className: isallday ? "threshold-editor__col-10 threshold-editor__list--padding" : "threshold-editor__col-5 threshold-editor__list--padding"

    }, [h_1('select', {
      value: AsyncValHook(this.model.getFrom()),
      onchange: function onchange(e) {
        return parentState.fromChange(_this.model, _this.model.getFrom(), e.target.value);
      }

    }, [_.range(24).map(function (o, i) {
      var hours = i.toString().length >= 2 ? i.toString() : "0" + i;
      var t = "00:00".replace(/00/, hours);
      return h_1('option', Object.assign({
        value: hours }, { selected: _this.model.getFrom() === hours }), [t]);
    }), h_1('option', Object.assign({
      value: "" }, { selected: this.model.getFrom() === "" }), ["all day"])])]), isallday ? "" : h_1('div', { className: "threshold-editor__col-5 threshold-editor__list--padding" }, [h_1('select', {
      onchange: function onchange(e) {
        return parentState.toChange(_this.model, e.target.value);
      }

    }, [_.range(24).map(function (o, i) {
      var hours = i.toString().length >= 2 ? i.toString() : "0" + i;
      var t = "00:00".replace(/00/, hours);
      return h_1('option', {
        value: hours,
        selected: _this.model.getTo() === hours
      }, [t]);
    })])])])])])]);
  }
});

var Time = Component(TimeConstructor);

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var ComparisonConstructor = ViewModel.extend({
  tpl: function tpl(props, state, parentState) {
    var _this = this;

    return h_1('span', null, [h_1('div', { className: "threshold-editor__col-2 threshold-editor__list--padding" }, [h_1('b', null, ["when the ErrorSystem"])]), h_1('div', { className: "threshold-editor__col-1 threshold-editor__list--padding" }, [h_1('select', null, [h_1('option', { value: "value" }, ["value"]), h_1('option', { value: "delta" }, ["delta"])])]), h_1('div', { className: "threshold-editor__col-2 threshold-editor__list--padding" }, [h_1('select', null, [[[">", "is greater than (>)"], ["<", "is less than (<)"], ["=", "is equa l to (=)"]].map(function (_ref) {
      var _ref2 = slicedToArray(_ref, 2),
          value = _ref2[0],
          text = _ref2[1];

      return h_1('option', {
        value: value,
        selected: value === _this.model.get("operator")
      }, [text]);
    })])])]);
  }
});

var Comparison = Component(ComparisonConstructor);

var tips = [{
  className: "threshold-editor__note threshold-editor__note--warn",
  text: "trigger a warning"
}, {
  className: "threshold-editor__note threshold-editor__note--error",
  text: "trigger an error"
}, {
  className: "threshold-editor__note threshold-editor__note--critical",
  text: "trigger a critical"
}];

var AlertConstructor = ViewModel.extend({
  tpl: function tpl(props, state, parentState) {
    var _this = this;

    var thresholds = this.model.getThreshold();
    var l = _.filter(thresholds, function (o) {
      return !!o;
    }).length;
    var inputList = state.selected ? thresholds.slice(0, 3) : thresholds.slice(0, l == 0 ? 1 : l);
    return h_1('span', null, [h_1('div', { className: "threshold-editor__col-3 threshold-editor__list--padding" }, [inputList.map(function (o, i) {
      return h_1('div', { className: "threshold-editor__threshold-container" }, [h_1('div', { className: "threshold-editor__threshold__value" }, [h_1('input', {
        type: "number",
        value: inputList[i],
        onchange: function onchange(_ref) {
          var value = _ref.target.value;
          return parentState.thresholdChange(_this.model, i, value);
        }
      })]), h_1('div', { className: "threshold-editor__threshold__tip" }, [h_1('span', { className: tips[i].className }, [tips[i].text, h_1('i')])])]);
    })])]);
  }
});

var Alert = Component(AlertConstructor);

var EditorRowConstructor = ViewModel.extend({
  tpl: function tpl(props, state, parentState) {
    var _this = this;

    return h_1('div', {
      className: state.selected ? "threshold-editor__single-rules threshold-editor__single-rules--active" : "threshold-editor__single-rules"

    }, [h_1('div', {
      className: "threshold-editor__trigger--itemclick",
      onclick: function onclick() {
        return parentState.itemClick(_this.model);
      }
    }, [h_1('span', {
      className: "threshold-editor__color-tab " + colors[state.index % colors.length]
    }), h_1('div', { className: "threshold-editor__row threshold-editor__list" }, [Time(Object.assign({}, {
      state: state,
      parentState: parentState,
      model: this.model,
      components: parentState.components,
      instanceName: "component-time-" + this.cid
    })), Comparison(Object.assign({}, {
      state: state,
      parentState: parentState,
      model: this.model,
      components: parentState.components,
      instanceName: "component-comparison-" + this.cid
    })), Alert(Object.assign({}, {
      state: state,
      parentState: parentState,
      model: this.model,
      components: parentState.components,
      instanceName: "component-alert-" + this.cid
    }))])]), state.selected ? h_1('a', {
      href: "javascript:;",
      className: "threshold-editor__delete",
      onclick: function onclick() {
        return parentState.removeItem(_this.model, state.index);
      } }) : ""]);
  }
});

var Row = Component(EditorRowConstructor);

var TimeLineConstructor = ViewModel.extend({
  tpl: function tpl(props, state, parentState) {
    var _this = this;

    var self = this;
    var list = [];
    this.collection.sortBy(function (model) {
      var start = model.getFrom();
      start = start === "" ? 24 : ~~start;
      return start;
    }).forEach(function (model, i) {
      list[_this.collection.length - 1 - i] = model;
    });
    return h_1('div', { className: "threshold-editor__timeline" }, [h_1('div', { className: "threshold-editor__time-panel" }, [_.range(12).map(function (hours) {
      return h_1('span', null, [2 + hours * 2 + ":00", "  "]);
    })]), h_1('div', { className: "threshold-editor__timebar-container" }, [_.map(list, function (model, i) {
      var isallday = model.isallday();
      var from = ~~model.getFrom() * 100 / 24 + "%";
      var to = (24 - ~~model.getTo()) * 100 / 24 + "%";
      var barStyle = isallday ? { width: "100%" } : {
        left: from,
        right: to
      };
      barStyle.zIndex = model.get("editing") ? list.length : i;
      if (model.getIsAcrossTheDay()) {
        return h_1('div', { className: "threshold-editor__timebar is-across-the-day " + colors[list.length - 1 - i]
        }, [h_1('div', { className: "threshold-editor__timebar__child", style: { left: 0, right: to } }), h_1('div', { className: "threshold-editor__timebar__child", style: { right: 0, left: from } })]);
      } else {
        return h_1('div', {
          className: "threshold-editor__timebar " + colors[list.length - 1 - i] + (isallday ? " is-allday" : ""),

          style: barStyle,
          onmousedown: function onmousedown(e) {
            self.mousedown(e, this, i, list.length + 1);
          } });
      }
    })])]);
  },
  mousedown: function mousedown(e, el, oldVal, newVal) {
    if (e.which == 1) {
      el.style.zIndex = newVal;
      var onselectstart = document.onselectstart;
      document.onselectstart = function () {
        return false;
      };
      var onmouseup = function onmouseup() {
        el.style.zIndex = oldVal;
        document.removeEventListener("mouseup", onmouseup);
        document.onselectstart = onselectstart;
      };
      document.addEventListener("mouseup", onmouseup);
    }
  }
});

var TimeLine = Component(TimeLineConstructor);

var globalClickCancel = false;
var Editor = ViewModel.extend({
  initialize: function initialize() {
    var _this = this;

    $(document).on("click", function (e) {
      if (!globalClickCancel) {
        _this.collection.forEach(function (model) {
          return model.set("editing", false);
        });
      }
      globalClickCancel = false;
    });
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.collection, "add remove change", this.render);
    this.render();
  },
  tpl: function tpl() {
    var _this2 = this;

    return h_1('div', { className: "threshold-editor", id: "threshold-editor-" + this.cid }, [h_1('div', { className: "threshold-editor__body" }, [h_1('div', { className: "threshold-editor__row threshold-editor__header" }, [h_1('div', { className: "threshold-editor__col-1" }, ["From", h_1('span', { className: "threshold-editor__split" })]), h_1('div', { className: "threshold-editor__col-1" }, ["Until", h_1('span', { className: "threshold-editor__split" })]), h_1('div', { className: "threshold-editor__col-5" }, ["Comparison", h_1('span', { className: "threshold-editor__split" })]), h_1('div', { className: "threshold-editor__col-3" }, ["Alerts"])]), h_1('div', { className: "threshold-editor__row threshold-editor__control" }, [h_1('div', { className: "threshold-editor__col-10" }, [h_1('a', {
      href: "javascript:;",
      className: "threshold-editor__button threshold-editor__button--add",
      onclick: function onclick() {
        return _this2.addNewItem();
      }
    }, ["add a new threshold (+)"])])]), h_1('div', { className: "threshold-editor__content" }, [this.collection.sortBy(function (model) {
      var start = model.getFrom();
      start = start === "" ? 24 : ~~start;
      return start;
    }).map(function (model, i) {
      return Row(Object.assign({}, {
        state: {
          index: i,
          selected: model.get("editing")
        },
        parentState: _this2,
        model: model,
        components: _this2.components,
        instanceName: "component-editor-row" + model.cid
      }));
    })])]), TimeLine(Object.assign({}, {
      parentState: this,
      collection: this.collection,
      components: this.components,
      instanceName: "component-time-line" + this.cid
    }))]);
  },
  itemClick: function itemClick(model) {
    globalClickCancel = true;
    model.set("editing", true);
    this.collection.filter(function (o) {
      return o.cid !== model.cid;
    }).forEach(function (model) {
      return model.set("editing", false);
    });
  },
  addNewItem: function addNewItem() {
    this.collection.add(new Threshold());
  },
  removeItem: function removeItem(model, index) {
    globalClickCancel = true;
    this.collection.remove(model);
    if (index < this.collection.length) {
      this.collection.models[index].set("editing", true);
    }
  },
  fromChange: function fromChange(model, oldVal, newVal) {
    if (newVal === "") {
      model.set({
        from: "",
        to: ""
      });
    } else {
      model.set(oldVal === "" ? {
        from: newVal + ':00',
        to: "00:00"
      } : {
        from: newVal + ':00'
      });
    }
  },
  toChange: function toChange(model, value) {
    model.set("to", value === "" ? "" : value + ":00");
  },
  thresholdChange: function thresholdChange(model, index, value) {
    switch (index) {
      case 0:
        model.setFirst(value);
        break;
      case 1:
        model.setSecond(value);
        break;
      case 2:
        model.setThree(value);
        break;
    }
  }
});

function Editor$1 () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(Editor, [null].concat(args)))();
}

var Thresholds = backbone.Collection.extend({
  model: Threshold,
  comparator: function comparator(m1, m2) {
    var time1 = m1.getFrom();
    var time2 = m2.getFrom();
    time1 = time1 === "" ? 24 : ~~time1;
    time2 = time2 === "" ? 24 : ~~time2;
    return time1 > time2 ? 1 : 0;
  }
});

function index (el) {
  var datas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  return new Editor$1({
    el: el,
    collection: new Thresholds(_.chain(datas.split(",")).compact().map(function (o) {
      return analysis(o);
    }).value())
  });
}

return index;

})));
