import React, {useEffect} from 'react'
import {deleteCitizen, getCitizens} from "../../store/actions/citizen";
import {useAppDispatch, useAppSelector} from "../../hooks";
import Tree from 'react-d3-tree';
import {CitizenType} from "../../models/ICitizen";
import {useCenteredTree} from "../../utils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate} from "react-router-dom";


type TreeItemProps = {
    data: CitizenType
    toggleNode(): void
}

export function TreeItem({data, toggleNode}: TreeItemProps) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    if (data.name === 'Какой то город') {
        return <g>
            <circle r="15" onClick={toggleNode}/>
            <text fill="black" strokeWidth="1" x="-55" dy="-25">
                {data.name}
            </text>
        </g>
    }

    return <g>
        <circle r="15" onClick={toggleNode}/>
        <EditIcon strokeWidth="1" x="500" y="-2000" sx={{transform: 'scale(0.03)'}} onClick={() => {
            navigate(`/citizens/${data.id}/citizen/edit`)
        }}/>
        <DeleteIcon strokeWidth="1" x="1300" y="-2000" sx={{transform: 'scale(0.03)'}} onClick={() => {
            dispatch(deleteCitizen(data.id))
        }}/>
        <text fill="black" strokeWidth="1" x="20" dy="-25">
            {data.name} {data.years}
        </text>
        <text fill="black" x="20" dy="-10" strokeWidth="1">
            Статус: {data.status_detail?.name}
        </text>
        <text fill="black" x="20" dy="5" strokeWidth="1">
            Должность: {data.job_detail?.name}
        </text>
        <text fill="black" x="20" dy="20" strokeWidth="1">
            Зарплата: {data.wage}
        </text>
    </g>
}

export default function CitizensPage() {
    const dispatch = useAppDispatch()
    const {citizens} = useAppSelector(state => state.citizenReducer)
    const [_, translate, containerRef] = useCenteredTree();

    useEffect(() => {
        dispatch(getCitizens())
    }, []);


    if (citizens.length === 0) return null
    console.log(citizens)
    return <div id="treeWrapper" ref={containerRef} style={{width: '100vw', height: '100vh', overflow: 'hidden'}}>
        <Tree data={{name: 'Какой то город', children: citizens}} orientation={'vertical'}
              translate={translate}
              pathFunc={'step'}
              nodeSize={{x: 300, y: 200}}
              renderCustomNodeElement={({nodeDatum, toggleNode}) => {
                  const data: CitizenType = {...nodeDatum} as any
                  return <TreeItem data={data} toggleNode={toggleNode}/>
              }}/>
    </div>
}
