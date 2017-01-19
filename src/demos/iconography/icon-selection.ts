import { Component } from "@angular/core";
import { CoreShapes } from "clarity-icons/shapes/core-shapes";
import { BasicShapes } from "clarity-icons/shapes/basic-shapes";
import { SocialShapes } from "clarity-icons/shapes/social-shapes";
import { TechnologyShapes } from "clarity-icons/shapes/technology-shapes";


let coreShapes = Object.keys(CoreShapes);
let basicShapes = Object.keys(BasicShapes);
let socialShapes = Object.keys(SocialShapes);
let technologyShapes = Object.keys(TechnologyShapes);


@Component({
    selector: "clr-icon-selection-demo",
    // Note the .css extension here, not .scss. That's the best we can have at the moment.
    styleUrls: ["./iconography.demo.scss"],
    templateUrl: "./icon-selection.demo.html"
})
export class IconSelectionDemo {

    hideShapesFromCore: string[] = [ "vm-bug" ];

    coreShapes: string[] = coreShapes.filter((shape) => {
        return this.hideShapesFromCore.indexOf(shape) === -1;
    });

    basicShapes: string[] = basicShapes;

    socialShapes: string[] = socialShapes;

    technologyShapes: string[] = technologyShapes;


}