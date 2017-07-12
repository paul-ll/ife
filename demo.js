document.writeln("<!-- Root element of PhotoSwipe. Must have class pswp. -->");
document.writeln("<div class=\"pswp\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">");
document.writeln("");
document.writeln("    <!-- Background of PhotoSwipe.");
document.writeln("         It\'s a separate element as animating opacity is faster than rgba(). -->");
document.writeln("    <div class=\"pswp__bg\"><\/div>");
document.writeln("");
document.writeln("    <!-- Slides wrapper with overflow:hidden. -->");
document.writeln("    <div class=\"pswp__scroll-wrap\">");
document.writeln("");
document.writeln("        <!-- Container that holds slides.");
document.writeln("            PhotoSwipe keeps only 3 of them in the DOM to save memory.");
document.writeln("            Don\'t modify these 3 pswp__item elements, data is added later on. -->");
document.writeln("        <div class=\"pswp__container\">");
document.writeln("            <div class=\"pswp__item\"><\/div>");
document.writeln("            <div class=\"pswp__item\"><\/div>");
document.writeln("            <div class=\"pswp__item\"><\/div>");
document.writeln("        <\/div>");
document.writeln("");
document.writeln("        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->");
document.writeln("        <div class=\"pswp__ui pswp__ui--hidden\">");
document.writeln("");
document.writeln("            <div class=\"pswp__top-bar\">");
document.writeln("");
document.writeln("                <!--  Controls are self-explanatory. Order can be changed. -->");
document.writeln("");
document.writeln("                <div class=\"pswp__counter\"><\/div>");
document.writeln("");
document.writeln("                <button class=\"pswp__button pswp__button--close\" title=\"Close (Esc)\"><\/button>");
document.writeln("");
document.writeln("                <button class=\"pswp__button pswp__button--share\" title=\"Share\"><\/button>");
document.writeln("");
document.writeln("                <button class=\"pswp__button pswp__button--fs\" title=\"Toggle fullscreen\"><\/button>");
document.writeln("");
document.writeln("                <button class=\"pswp__button pswp__button--zoom\" title=\"Zoom in\/out\"><\/button>");
document.writeln("");
document.writeln("                <!-- Preloader demo http:\/\/codepen.io\/dimsemenov\/pen\/yyBWoR -->");
document.writeln("                <!-- element will get class pswp__preloader--active when preloader is running -->");
document.writeln("                <div class=\"pswp__preloader\">");
document.writeln("                    <div class=\"pswp__preloader__icn\">");
document.writeln("                        <div class=\"pswp__preloader__cut\">");
document.writeln("                            <div class=\"pswp__preloader__donut\"><\/div>");
document.writeln("                        <\/div>");
document.writeln("                    <\/div>");
document.writeln("                <\/div>");
document.writeln("            <\/div>");
document.writeln("");
document.writeln("            <div class=\"pswp__share-modal pswp__share-modal--hidden pswp__single-tap\">");
document.writeln("                <div class=\"pswp__share-tooltip\"><\/div>");
document.writeln("            <\/div>");
document.writeln("");
document.writeln("            <button class=\"pswp__button pswp__button--arrow--left\" title=\"Previous (arrow left)\">");
document.writeln("            <\/button>");
document.writeln("");
document.writeln("            <button class=\"pswp__button pswp__button--arrow--right\" title=\"Next (arrow right)\">");
document.writeln("            <\/button>");
document.writeln("");
document.writeln("            <div class=\"pswp__caption\">");
document.writeln("                <div class=\"pswp__caption__center\"><\/div>");
document.writeln("            <\/div>");
document.writeln("");
document.writeln("        <\/div>");
document.writeln("");
document.writeln("    <\/div>");
document.writeln("");
document.writeln("<\/div>");


(function() {

      var initPhotoSwipeFromDOM = function(gallerySelector) {

    // 解析来自DOM元素幻灯片数据（URL，标题，大小...）
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // 仅包括元素节点
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // 创建幻灯片对象
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> 缩略图节点, 检索缩略图网址
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // 保存链接元素 for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // 查找最近的父节点
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // 当用户点击缩略图触发
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
          barsSize: { 
            top: 100,
            bottom: 100
          },           

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');

    })();