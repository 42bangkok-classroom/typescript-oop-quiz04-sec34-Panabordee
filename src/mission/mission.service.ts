import { Injectable } from '@nestjs/common';
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
  findAll(): Array<{
    id: string;
    codename: string;
    status: string;
    startDate: string;
    endDate: string | null;
    durationDays: number;
  }> {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const rawData: string = fs.readFileSync(filePath, 'utf-8');

    const parsed: unknown = JSON.parse(rawData);

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid missions data format');
    }

    const missions: IMission[] = parsed as IMission[];

    return missions.map((mission: IMission) => {
      const durationDays: number =
        mission.endDate !== null
          ? Math.floor(
              (new Date(mission.endDate).getTime() -
                new Date(mission.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : -1;

      return {
        id: mission.id,
        codename: mission.codename,
        status: mission.status,
        startDate: mission.startDate,
        endDate: mission.endDate,
        durationDays,
      };
    });
  }
}
