import {
    Injectable
} from "@angular/core";
// import { Subject, Observable } from "rxjs";
import { NewWizardPage } from "../wizard-page";

@Injectable()
export class ButtonHubService {
    // create Observables for when list of pages changes

    // TODO: CAPTURES BUTTON EVENTS AND DISTRIBUTES THEM TO WHERE THEY NEED TO GO
    // OFFERS A SINGLE POINT OF ENTRY, DIFFERENTIATED BY TYPE OF BUTTON
    // WITH MULTIPLE EXIT POINTS, DIRECTED BY TYPE OF BUTTON


    public whatever: NewWizardPage;

}