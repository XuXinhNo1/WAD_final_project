import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TablesService } from './tables.service';
import { TablesExportService } from './tables-export.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly tablesExportService: TablesExportService,
  ) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  // API 1: Tải tất cả QR code (ZIP)
  // Đặt endpoint này TRƯỚC @Get(':id') để tránh bị nhầm 'qr/download-all' là một cái id
  @Get('qr/download-all')
  async downloadAllZip(@Res() res: Response) {
    // Lấy tất cả bàn từ DB (Tận dụng hàm findAll của TV1)
    const tables = await this.tablesService.findAll({}); 
    // Gọi service export để nén zip
    return this.tablesExportService.generateAllQrsZip(tables, res);
  }

  // API 2: Tải PDF của 1 bàn
  @Get(':id/qr/download')
  async downloadTablePdf(@Param('id') id: string, @Res() res: Response) {
    // Lấy thông tin bàn từ DB
    const table = await this.tablesService.findOne(id);
    // Gọi service export để tạo PDF
    return this.tablesExportService.generateTablePdf(table, res);
  }
  
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('location') location?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.tablesService.findAll({ status, location, sortBy });
  }

  @Get('locations')
  getLocations() {
    return this.tablesService.getLocations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.tablesService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}
