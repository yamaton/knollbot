/**
* Mostly just copying the Matter.js development demo and testing tool.
*/

(function () {

    var examples = [
        {
            name: 'Knollbot',
            id: 'knollbot',
            init: Knollbot.main,
        }
    ];


    if (window.location.search.indexOf('compare') >= 0) {
        var compareScript = document.createElement('script');
        compareScript.src = '../js/Compare.js';
        window.MatterDemo = { examples: examples };
        document.body.append(compareScript);
        return;
    }

    var demo = MatterTools.Demo.create({
        toolbar: {
            title: 'matter-js',
            url: 'https://github.com/liabru/matter-js',
            reset: true,
            source: true,
            inspector: true,
            tools: true,
            fullscreen: true,
            exampleSelect: true
        },
        tools: {
            inspector: true,
            gui: true
        },
        inline: false,
        preventZoom: true,
        resetOnOrientation: true,
        routing: true,
        startExample: 'mixed',
        examples: examples
    });

    document.body.appendChild(demo.dom.root);

    MatterTools.Demo.start(demo);
})();
