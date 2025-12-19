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
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QrService } from '../qr/qr.service';

@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly qrService: QrService,
  ) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
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

  // QR Code Endpoints

  /**
   * Generate QR token for a table
   * POST /tables/:id/qr/generate
   */
  @Post(':id/qr/generate')
  generateQr(@Param('id') id: string) {
    return this.qrService.generateQrToken(id);
  }

  /**
   * Regenerate QR token for a table (invalidates old token)
   * POST /tables/:id/qr/regenerate
   */
  @Post(':id/qr/regenerate')
  regenerateQr(@Param('id') id: string) {
    return this.qrService.regenerateQrToken(id);
  }

  /**
   * Get table with QR URL
   * GET /tables/:id/qr
   */
  @Get(':id/qr')
  getTableQr(@Param('id') id: string) {
    return this.qrService.getTableWithQrUrl(id);
  }
}
