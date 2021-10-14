const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x6d7c80,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
});
document.body.appendChild(app.view);

const maskArray = [
"1 Water in space_mask-01.svg.json",
"4 Water access vs GDP_mask-01-01.svg.json",
"6 Baseline water stress_mask-01.svg.json",
"7 Co2 Emission through the years_mask-01.svg.json",
"11 Rain pH and Co2_mask-01.svg.json",
"14 CO2 conc in ice core sample_legend_mask-01.svg.json",
"15 Black carbon annual data_mask-01.svg.json",
"16 glacier data_mask_1-01.svg.json",
"17 Aral sea river dynamics_mask-01.svg.json",
"21 Cotton production_mask-01.svg.json",
"23 Marathawada drought Groundwater_mask-01.svg.json",
"30 River Interlinking_mask-01.svg.json",
"32 Drying cities_Bangalore_mask-01.svg.json",
"35 Cola Cola Water Usage_mask-01-wOffset.svg.json",
"44 Guiyu - PDBE in Fish_mask-01-01-wOffset.svg.json",
"48_class 1b cities _sewage_mask-01-wOffset.svg.json",
"48_class 1 cities _sewage_mask-01-wOffset.svg.json",
"52 Xenoestrogen in infertile men_mask-01.svg.json",
"53 Bottled water consumption_mask-01-Simplified.svg.json",
"58 Area of hypoxia in Gulf of mexico_mask-01.svg.json"
]

document.getElementById("m").addEventListener('change', (event) => {
    const n = event.target.value
    fetch(maskArray[n])
        .then(res => res.json())
        .then(data => {

            const t = new PIXI.Graphics();
            t.beginFill(0xFFFFFF);
            for (i of data.shapes){
                console.log(i.shape)
                t.drawPolygon(i.shape);
            }
            t.endFill();
            console.log(t.getBounds());
            app.stage.removeChildren();
            app.stage.addChild(t);
            t.position.x = t.position.x-t.getBounds().x;
            //            app.render(app.stage);

        });

});
