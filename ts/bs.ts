/// <reference path="bs/definitions/definitions.d.ts" />

$(document).ready(() => {

    let loader = new bs.core.Loader();

    loader.setManifest([
        { id: "MAP",        src: "map.png" },
        { id: "LOGO",       src: "logo.png" },
        { id: "MARK",       src: "mark.png" },
        { id: "TARGET",     src: "target.png" },
        { id: "PLAYER",     src: "player.png" },
        { id: "CRUISER",    src: "ships/cruiser.png" },
        { id: "CARRIER",    src: "ships/carrier.png" },
        { id: "SUBMARINE",  src: "ships/submarine.png" },
        { id: "DESTROYER",  src: "ships/destroyer.png" },
        { id: "BATTLESHIP", src: "ships/battleship.png" }
    ]);

    loader.loadAssets(
        () => {
            new bs.core.Game().setup();
            $("[data-toggle=\"tooltip\"]").tooltip();
        },
        () => { console.error("Error while loading assets..."); }
    );

});
