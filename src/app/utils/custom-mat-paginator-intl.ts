import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();  

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel = this.translate.instant('GLOBAL.elementos');
    this.nextPageLabel = this.translate.instant('GLOBAL.siguiente');
    this.previousPageLabel = this.translate.instant('GLOBAL.previa');
    this.firstPageLabel = this.translate.instant('GLOBAL.primera');
    this.lastPageLabel = this.translate.instant('GLOBAL.ultima');
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}