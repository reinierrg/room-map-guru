import {
    ChevronDown,
    ChevronRight,
    HousePlus,
    House,
    X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useRelations } from '../hooks/useRelations'
import { useRooms } from '../hooks/useRooms'
import { SubordinateSelector } from './SubordinateSelector'
import { SubordinateItem } from './SubordinateItem'
import type { IRoom } from '../services/room/room.types'
import { useAgents } from '../hooks/useAgents'

export const RoomCard = ({ room }: { room: IRoom }) => {
    const { rooms, setRooms } = useRooms()
    const { relations, setRelations, addRelation, removeRelation } = useRelations()
    const { getAgentById: getTypeById } = useAgents()

    const [expandedPeople, setExpandedPeople] = useState<Record<number, boolean>>({})
    const [showSubordinateSelector, setShowSubordinateSelector] = useState<Record<number, boolean>>({})
    const [subordinateSearchTerm, setSubordinateSearchTerm] = useState('')

    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]) 
    const getRoomById = (id: any) => roomsMap.get(id)

    const toggleExpanded = (id: number) => {
        setExpandedPeople(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const toggleSubordinateSelector = (id: number) => {
        setShowSubordinateSelector(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const isRoomDescendant = (roomId: number, potentialSupervisorId: number): boolean => {
        const subs = relations[roomId] || []
        if (subs.includes(potentialSupervisorId)) return true
        return subs.some((subId) => isRoomDescendant(subId, potentialSupervisorId))
    }

    const getAvailableSubordinates = (supervisorId: number): Partial<IRoom>[] => {
        const supervisor = getRoomById(supervisorId)
        const currentSubs = relations[supervisorId] || []
        return rooms.filter((r: any) =>
            r.id !== supervisorId &&
            !currentSubs.includes(r.id) &&
            !isRoomDescendant(r.id, supervisorId) &&
            r.name.toLowerCase().includes(subordinateSearchTerm.toLowerCase()) &&
            (supervisor?.type !== 'Interno' || r.type !== 'Interno')
        )
    }

    const addSubordinate = (supId: number, subId: number) => {
        addRelation(supId, subId)
        setShowSubordinateSelector(prev => ({ ...prev, [supId]: false }))
        setSubordinateSearchTerm('')
    }

    const deleteRoom = (roomId: number) => {
        const hasSubordinates = (relations[roomId] || []).length > 0
        if (hasSubordinates) {
            alert('No se puede eliminar una habitación con hijas.')
            return
        }

        const updatedRooms = rooms.filter((r) => r.id !== roomId)
        const newRelations = { ...relations }
        delete newRelations[roomId]
        Object.keys(newRelations).forEach((supId) => {
            newRelations[Number(supId)] = newRelations[Number(supId)].filter((id) => id !== roomId)
        })

        setRooms(updatedRooms)
        setRelations(newRelations)
    }

    const isManager = room.type === 'Interno'
    const subordinates = relations[room.id] || []
    const isExpanded = expandedPeople[room.id]
    const showSelector = showSubordinateSelector[room.id]
    const roomType = getTypeById(room.type)
    const availableSubordinates = getAvailableSubordinates(room.id)

    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
            <div className='p-4 border-b border-b-gray-100'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {subordinates.length > 0 && (
                            <button onClick={() => toggleExpanded(room.id)} className="p-1 hover:bg-gray-100 rounded">
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                        )}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white`}>
                            <img src={roomType?.icon} width={16} height={16}/>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{room.name}</h3>
                            <p className="text-sm text-gray-500">{room.position}</p>
                            {/*isManager && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                                    Habitacion Base
                                </span>
                            )*/}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {subordinates.length > 0 && (
                            <span className="text-sm text-gray-500 flex items-center gap-1 ms-0.5">
                                <House size={18} /> {subordinates.length}
                            </span>
                        )}
                        <button onClick={() => toggleSubordinateSelector(room.id)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500">
                            <HousePlus size={18} />
                        </button>
                        {!isManager && (
                            <button onClick={() => deleteRoom(room.id)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showSelector && (
                <SubordinateSelector
                    availableSubordinates={availableSubordinates}
                    onSelect={(id) => addSubordinate(room.id, id)}
                    onSearchChange={setSubordinateSearchTerm}
                    searchValue={subordinateSearchTerm}
                    getTypeById={getTypeById}
                />
            )}

            {isExpanded && subordinates.length > 0 && (
                <div className="p-4">
                    {subordinates.map((subordinateId) => {
                        const subordinate = getRoomById(subordinateId)
                        return subordinate ? (
                            <SubordinateItem
                                key={subordinateId}
                                room={subordinate}
                                supervisorId={room.id}
                                level={0}
                                expandedPeople={expandedPeople}
                                toggleExpanded={toggleExpanded}
                                removeRelation={removeRelation}
                                getTypeById={getTypeById}
                                relations={relations}
                              
                            />
                        ) : null
                    })}
                </div>
            )}
        </div>
    )
}


/*
unioco(HS)
<img class="XNo5Ab" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAY1BMVEUZKjYYKTUVJDETIC4UIzAYKDQfND89ZWtBam9MfH9EcHUrRk9PgYQbLjkiOEN4xMGH29aF2NQ2WF9cl5hus7JzvLqB0s4KEiUQHCtDbXMlPkckPEU5XWNIdntXj5FioKEuTFSTUgjIAAAAtElEQVR4AezNNRbDQAwAUaGZme37XzKscKq03m7eX0nw10MiZhbSS6nwucwc1/N9P3DDs2roR34UBYA3jpM0y11bVJRpFYVoqVg3TWGbqPWcTh9H4YxkKf1g9gN3HJ+RqryZ5I6Bgw8ELvO8Zyua4RnFzfOlu4WGHj0ZKFR5HettTRDqMwIVzWmUEEC7yQYfi4s6W0MSGudAEd41DtZqXaJ5I7Pnu8yEoHIcK640ygjRRDkAAN+LDKThu+ePAAAAAElFTkSuQmCC" style="height:26px;width:26px" alt="" data-csiid="tKOsaLaBJcKSwbkPqoKdyQc_12" data-atf="4"></img>

expedia
<img class="XNo5Ab" id="tsuid_0qSsaMbYJLWFwbkP1fS8sA0_38" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1UlEQVRYhcWXzUsVURiHn3Pu3Kt18wODVDKL6BaVUamLNq0KDFy0bqGBK8uWtcqQKIJatIhUCIrS/yAw0Ig2bXWlFV4hEOGWoKT5cfXeOW+L8fp1Z2RGR/2thnPOnOc35z1z3vco1skk62oEeQA0AOWEq9/AF5R6HDk1mMw1qtyDnaztBlpDhnqpM5IYugegAeyxPYUDtNnJ2tcAyh6rSyAyuofwNSmVsBDp2GqMVqwL1PZkjEeHSLsFXPOEWzA9rZj6q1DbMCECBTGh+rjBLLlOcN0CKlzhMRj5qalpKAQkOH1VipZbNm9fpDHpPBMVyk7W5s2+Hl5eJWi9Az6QGleMf1vkWKXkhcPKg0dg+Ifmwo1ComXCbNo/qOQAHqESMlmF20rmGSACr3qjtDbbzgb0Cy8SevsiZLPuJrz2UJ4Bswxvni2BChD3OPS8jzExCZWH/b/maiBnwu+/p+NCd3eMu+1RKqvXTIt4f/WG931RtoK/y4enpsCyHBO7ZsATPq748CRDU6PNzOIuGdgK3vU0Q/PtDDP/fIYwbPidlmWYDzBf2HAzH+zM9m1AHwwf7tuAtuDjp2jocN8G0PBrQkNxuHDwOIjcZAwwq0ghMBsO3NOA1kBs4ylytd7m5SMnM544KtxszOwY7mpAa5icUrQ8LORQHLJZuHLRcL91ifpLK0ADZiEIXHmeiq4rMLeg6PusKS4XZhcBcbaKkyOCKZf/y0rEta5xNeAkESFesDLI907ZqIyBPxOK4f40paWCyfo0YBsARWpcAMXcQvCSzAhkpxUjA2nOnTFeq2csYBI4stpi4GSVYexrGq2djFYUF3AvKj2kWM7A94E0Z73hACllJ2t7gKbNPRvqQHG+KIh0AZAFY285rEeZZN15QYaDTR+aTmudGBwBuvYB3hlJDCX363LaFUkMtcGmws8evZxAqQ6c25LrhWUHmgT6FTzXiaGRXON/c2c8LX6hzuYAAAAASUVORK5CYII=" style="height:26px;width:26px" alt="" data-deferred="3" data-csiid="0qSsaMbYJLWFwbkP1fS8sA0_1" data-ims="1756144852059" data-iml="1756144852060" data-atf="1">

prece travel
<img class="XNo5Ab" id="tsuid_EqWsaNKwLJ-OwbkP7-TvmQE_46" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE3klEQVRYhZWXa4wTVRTHf7cdSbQNCmEnCLiCmPBSElQ0gRbFaKuAdowmYGyDuMUoQRNCV5T4SIzyASrxgSHRlghblUSDHUBgmwBCF3whG1HwBQF8fLALQUM3IbHb64dtYTo9s8D51Htev387d869VXiYVewNafQ0hcrmw4HTXnkD2WMHtSr39i4CTtrh4FYpR0nOWLF3DugtjqwZdihYvBx4rKt3BFr/BAyuuV60w8HX3Xk+uVzHGpfsjRXLiy4VbnWVZ6D1Xw44wENSrocAtVZwvhsrlt+/GDxWLC/Wmj1CaM2AAkqkbuqhfRiAHQ4cVErNEvKTsWL5ywHgWeAdIbTcDgc/kGpUDf4zMK7mW2KSfrPW8F6gINSdUkqNz4cubM5Ysfw1cLuAWGaHAyvrq3gkMw9IAZtyheQKVSI1BTjoqnrVJP0KgNXVG9Fad0rqgVuVj2O6ylFgmBBfZoeDTvhC4D1HfI7Ph/9HofDlEqm3APKhQAFUxEPAd7pKyQP+nAs+1wUHmFB/BJOB74UmOZN0AiDWVb4bzU4PIW5baoeDqx3wB4DN7iSlfNf4AEzShxTipouXSOUB7FBwF3DPxdkq1QjPzpTgoO7q6Hzi3/NvQQurtgNPCx1jJVK7AexwcKeCmQPQl9jhwBv1RSKanQp6l5D3fK7QtgeESVgitQJ4QSjqNknfAmAVy9M0dLnqF9rhYKa+iEcyXo91c66QPD/oxFFcIvUxME8I/WKSHl9f1F7TK31KFT4LBc7V/YlodqzW+qhQfzJXSI52OkQBNRFFICSE9pukp3vVJaLZEbp/DDeZ8qnBHTvazjp9HqMYTNJh4IgQmtZD+yivOq31AREOd7jhAwroL1LSXgAYLjnjkcxU4Foh9GxHIfmNVOMpoET7FI22pZgfJW0ugOsF35lcISmdD94CekiNAu0ez3VbMpSV/4kRRbfgHRKPZDZ4CWjahKdov6qKPgMMEvKXmqRXA1TyzAXGKtjjt9hXT4hHMruQZoViYa4zmWl2u6xE6m/AFOCPm6TX920moKucoHH+bzMsZjtEHAdGN8GUmtzR2faD09fwCEqkjnjAHzRJrwfQVY7TfPjMquT5tL4YenXwBqDH3URrfSARXdfwyzovJF8AE5pUo6abpLcAVPL8BrQIAgEeruT7LyNvfzJP4/e3Au7XbpDW1YZ94qvBPwLuFJre3MKq/TX4PuBGD3jdFlfyLAfIbV9wTqGuAyqunInxSGbd+S9YInUb8K0rqapQY1pY9XsNvgmPS6WHzTcsNgDEo9kRyJNxfq6Q3KCEu8BZha+1hZX/1OBrgaeEBr8C8wHxjqjgPr9FZ03EWISzQSlG+kzSh4BlQAnYrfAPd8CXe8C7DYtxhsVXSjGa5p8ZDTsqNlMAcp1txxT9nxtyNLM9D6NKngXAOiG007AaLyYVmyFoTtD4PwAAn6LVF+MPgEQkE9awtx5TqDGigEqe+4FtQmijYfGoVKO3ckVfhePASHc7FKYR4wxAIpqZpDULgA9zhWR3kwBdRPWdpiow1hgWz0hwl/jDwESX+4BhMVXKbzoL+k7TKuS9dClwAMNiElwYzTVrmi+eAgyLk8CfDteThsVrlwJ39AgBzpN0o1euuAf0Dnx953gExWEjxuHLgTutkicKGIbF5145/wP3zKGbYpuyGwAAAABJRU5ErkJggg==" style="height:26px;width:26px" alt="" data-deferred="3" data-csiid="EqWsaNKwLJ-OwbkP7-TvmQE_1" data-ims="1756144916290" data-iml="1756144916293" data-atf="1">

hotel beds(HB)
<img class="XNo5Ab" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAARVBMVEVHcEwALlYAMFcAMFgANVsAM1oAMVgAMFcAMFcAMFcAMFeh0st8pqkAKFOg0suLubcAHk6gxMCcI1OcJ1WdKFa2IVO2JVXTFFQ5AAAAFnRSTlMAM/+lFSFRgcHa8X+Z/////zr//6MzxW6aNAAAAIJJREFUeAHdz0UCAzEIQNEoVtf737QGtUh1VvPWPwGc8UHF5EpjDVI+S70gAUZiJoTcDCBKMASNgDncCZRBSXwZlOhdEHwj4BhJgkE3UdNZUBIhJ4/XgtxcLZZBRb0+BsVlwHYZiH1YBuQ18BxUGdgEl7tBGj5YmfXmYlsFZrdXIw2OUwUPsZvep5IAAAAASUVORK5CYII=" style="height:18px;width:18px" alt="" data-csiid="VaWsaKaaI5ONwbkPsuyJmQg_2" data-atf="1">

*/
