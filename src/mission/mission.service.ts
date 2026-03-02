import { Injectable, NotFoundException } from '@nestjs/common';
import { IMission } from './mission.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary(): Record<string, number> {
    return this.missions.reduce<Record<string, number>>((acc, mission) => {
      acc[mission.status] = (acc[mission.status] ?? 0) + 1;
      return acc;
    }, {});
  }

  findAll(): Array<IMission & { durationDays: number }> {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const rawData: string = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(rawData) as IMission[];

    return missions.map((mission) => {
      const durationDays: number = mission.endDate
        ? Math.floor(
            (new Date(mission.endDate).getTime() -
              new Date(mission.startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : -1;

      return {
        ...mission,
        durationDays,
      };
    });
  }

  remove(id: string): { message: string } {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const rawData: string = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(rawData) as IMission[];

    const missionIndex: number = missions.findIndex(
      (mission) => mission.id === id,
    );

    if (missionIndex === -1) {
      throw new NotFoundException();
    }

    missions.splice(missionIndex, 1);

    fs.writeFileSync(filePath, JSON.stringify(missions, null, 2), 'utf-8');

    return {
      message: `Mission ID ${id} has been successfully deleted.`,
    };
  }
}
