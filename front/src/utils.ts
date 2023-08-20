import {useCallback, useState} from "react";
import {CitizenType} from "./models/ICitizen";
import {INavItem} from "./App";

export function checkNavValidate(navList: INavItem[], validate: boolean) {
    const newList: INavItem[] = []
    navList.forEach(val => {
        if (!val.validate) newList.push(val)
        else if (validate) newList.push(val)
    })
    return newList
}

export const updateElementInList = (list: any[], newEl: any) => {
    return list.map(el => {
        if (el.id === newEl.id) return newEl
        return el
    })
}

export const deleteElementFromList = (list: any[], id: number) => {
    const newList: any[] = [];
    list.forEach(el => {
        if (el.id !== id) {
            newList.push(el)
        }
    })
    return newList
}

export function recursiveTree(findList: CitizenType[]) {
    const glList:CitizenType[] = []
    findList.forEach((val) => {
        if (!val.obey) glList.push(val)
        if (val.subordinates.length > 0) {
            val.children = val.subordinates.map(sub => findList.find(v => v.id === sub)!)
        }
    })
    return glList
}

export const useCenteredTree = (defaultTranslate = {x: 0, y: 0}) => {
    const [translate, setTranslate] = useState<any>(defaultTranslate);
    const [dimensions, setDimensions] = useState<any>();
    const containerRef: any = useCallback((containerElem: any) => {
        if (containerElem !== null) {
            const {width, height} = containerElem.getBoundingClientRect();
            setDimensions({width, height} as any);
            setTranslate({x: width / 2, y: 100});
        }
    }, []);
    return [dimensions, translate, containerRef];
};