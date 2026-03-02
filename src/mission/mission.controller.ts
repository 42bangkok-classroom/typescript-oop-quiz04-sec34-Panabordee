import { Controller, Get, Delete, Param } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    return this.missionService.remove(id);
  }
}
