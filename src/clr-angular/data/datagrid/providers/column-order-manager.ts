/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ColumnOrderManager {

    public orders: number[] = [];

    public positionOrdersUpdated = new Subject<any>();

    public positionOrdersRendered = new Subject<any>();
}
