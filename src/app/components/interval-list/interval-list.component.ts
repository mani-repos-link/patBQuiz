import {
  Component, ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent, Subject, Subscription} from "rxjs";
import {QuizSetting, SettingsService} from "../../services/setting/settings.service";


export class IntervalNodes {
  totalQuiz: number = 0;
  child?: IntervalNodes[];
  cols: number | undefined;
  index: number | undefined;
  active?: boolean | undefined;
  siblings?: IntervalNodes[];
  startRange?: number;
  endRange?: number;
}

class IntervalProgressiveData {
  // contains the information of shown intervals
  index: number = 0;
  children?: IntervalNodes[] = [];
}

@Component({
  selector: 'app-interval-list',
  templateUrl: './interval-list.component.html',
  styleUrls: ['./interval-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntervalListComponent implements OnInit, OnDestroy {
  @ViewChild('intervalContainer', { static: true, read: ElementRef })
  intervalContainer!: ElementRef;
  @Input()
  set itemsSize(is: number | undefined) {
    this._itemsSize = is;
    // @ts-ignore
    if ('' + this._itemsSize !== 'null' && this._itemsSize > 0) {
      this.generateIntervalNodesData();
      this.emitData();
    }
  }
  get itemsSize(): number | undefined {
   return this._itemsSize;
  };
  private _itemsSize: number | undefined = 30;
  @Input() enableFinalRow: boolean | undefined = true;
  @Input() intervalDivision: { [x: string]: number } = {
    '30000': 2500, // if quiz list has more than 2k quizzes, then it divides up with 1000
    '20000': 2000, '10000': 2000,
    '2000': 1000, '1500': 500, '1000': 100,
    '200': 20, '100': 10, '50': 10, '10': 1
  }
  @Output() currentInterval: EventEmitter<any> = new EventEmitter<any>();
  public intervalsTree: IntervalNodes[] = [];
  public intervalsData: IntervalProgressiveData = new IntervalProgressiveData();
  private dataEmitter = new Subject();
  private dataEmitter$;
  private subscription = new Subscription();
  set finalRangeRow(d: { start: number, end: number } | any) {
    this._finalRangeRow = d;
  }

  get finalRangeRow(): { start: number, end: number } | any {
    return this._finalRangeRow;
  };
  private _finalRangeRow: { start: number, end: number } | any = {};
  currentActiveQuestion = 0;
  private intervalContainerSticky!: number;
  quizSetting!: QuizSetting;

  get rangeNumbers() {
    if (this.finalRangeRow && this.finalRangeRow.start != null && this.finalRangeRow.end != null) {
      return [...Array(this.finalRangeRow.end - this.finalRangeRow.start).keys()].map(i => i + this.finalRangeRow.start);
    }
    return [];
  }

  constructor(
    private settingSvc: SettingsService,
  ) {
    this.dataEmitter$ = this.dataEmitter.pipe(
      distinctUntilChanged(),
      debounceTime(100)
    );
    this.dataEmitter$.subscribe((d) => {
      this.currentInterval.emit(d);
    });
  }

  ngOnInit(): void {
    this.generateIntervalNodesData();
    this.intervalContainerSticky = this.intervalContainer?.nativeElement?.offsetTop;
    const mainContentContainerBody = document.getElementsByClassName('main-content-container')[0];
    mainContentContainerBody.addEventListener('scroll', (e) => {
      if (this.intervalContainerSticky == null) {
        this.intervalContainerSticky = this.intervalContainer?.nativeElement?.offsetTop;
      }
      if (this.quizSetting?.stickIntervalOnScroll) {
        if (mainContentContainerBody.scrollTop > this.intervalContainerSticky) {
          this.intervalContainer?.nativeElement?.classList?.add("sticky");
        } else {
          this.intervalContainer?.nativeElement?.classList?.remove("sticky");
        }
      } else {
        this.intervalContainer?.nativeElement?.classList?.remove("sticky");
      }
    }, true);
    this.listenSetting$();
  }

  private listenSetting$() {
    this.settingSvc.quizSettingSubject.subscribe((s: QuizSetting) => {
      this.quizSetting = s;
      if (this.intervalsTree?.length > 0) {
        s.isEnabledStickyIntervalOption = true;
      }
    });
  }

  private generateIntervalNodesData() {
    const leastSmallInterval = Object.keys(this.intervalDivision).sort()[0];
    if (this.itemsSize && +leastSmallInterval >= this.itemsSize) {
      this.intervalsTree = [new IntervalNodes()];
      this.intervalsTree[0].totalQuiz = this.itemsSize;
      this.intervalsTree[0].cols = 1;
      this.intervalsTree[0].active = true;
      this.intervalsTree[0].startRange = 0;
      this.intervalsTree[0].endRange = this.itemsSize;
    } else {
      this.intervalsTree = this.generateIntervalTree(this.itemsSize || 0, this.intervalDivision, +leastSmallInterval);
    }
    this.intervalsData.children = this.intervalsTree[0].child;
    this.generateActiveIndexList(this.intervalsTree[0]);
    this.findDeepRange(this.intervalsTree[0]);
  }

  onQuizQuestionNumberClick(questionNum: number) {
    this.currentActiveQuestion = questionNum;
    this.emitData();
  }

  onIntervalClick(item: IntervalNodes, x: any) {
    this.generateActiveIndexList(item);
    x.index = 0;
    if (x?.children?.length > 0 && item.child) {
      x.children = item.child;
    }
    this.finalRangeRow = {start: item.startRange, end: item.endRange}
    this.findDeepRange(item);
    this.emitData();
  }

  private findDeepRange(intervalNode: IntervalNodes) {
    if (intervalNode?.child && intervalNode?.child?.length > 0) {
      const node = intervalNode.child[0];
      if (node.active) {
        this.findDeepRange(node);
      } else {
        this.finalRangeRow = {start: node.startRange, end: node.endRange};
        this.currentActiveQuestion = this.finalRangeRow.start;
      }
    } else if (intervalNode.active) {
      this.finalRangeRow = {start: intervalNode.startRange, end: intervalNode.endRange};
      this.currentActiveQuestion = this.finalRangeRow.start;
    }
  }

  private generateActiveIndexList(interval: IntervalNodes) {
    if (interval?.child) {
      interval.child.forEach((c: IntervalNodes) => {
        c.active = false;
      });
      this.generateActiveIndexList(interval.child[0]);
    }
    if (interval.siblings) {
      interval.siblings.forEach((c: IntervalNodes) => {
        c.active = false;
      });
    }
    if (interval) {
      interval.active = true;
    }
  }

  private generateIntervalTree(
    itemsSize: number, intervalsMap: { [x: string]: number },
    leastSmallInterval: number, startRange: number = 0
  ): IntervalNodes[] {
    const result = this.calculateNumberOfIntervals(itemsSize, intervalsMap);
    const numOfIntervals = result['numOfIntervals'];
    const intervalSize = result['intervalSize'];
    if (itemsSize <= leastSmallInterval) {
      return [
        {
          totalQuiz: itemsSize,
          child: undefined,
          cols: itemsSize,
          startRange: startRange,
          endRange: startRange + itemsSize,
          index: 0
        }];
    }
    const ranges = this.getIntervalRanges(itemsSize, intervalSize, numOfIntervals);
    const list: IntervalNodes[] = [];
    const siblings: IntervalNodes[] = [];
    let siblingStartRange = 0;
    ranges.forEach((itmSize: number, idx: number) => {
      const ld: IntervalNodes = {
        totalQuiz: itemsSize, child: undefined, cols: ranges.length,
        index: idx, siblings
      };
      if (itmSize < intervalSize) {
        ld.totalQuiz = itmSize;
        ld.startRange = startRange + intervalSize * idx;
        ld.endRange = ld.startRange + ld.totalQuiz;
      } else {
        ld.totalQuiz = itmSize;
        ld.startRange = startRange + idx * ld.totalQuiz;
        ld.endRange = startRange + (idx * ld.totalQuiz) + ld.totalQuiz;
      }
      ld.child = this.generateIntervalTree(itmSize, intervalsMap, leastSmallInterval, ld.startRange);
      siblingStartRange += ld.startRange;
      list.push(ld);
      siblings.push(ld);
    });
    return list;
  }

  private getActiveInterval(intervalSizes: IntervalNodes[]): IntervalNodes | any {
    if (intervalSizes == null || intervalSizes.length == 0) {
      return null;
    }
    for (let i = 0; i < intervalSizes.length; i++) {
      const interval = intervalSizes[i];
      // @ts-ignore
      if (this.currentActiveQuestion >= interval.startRange && this.currentActiveQuestion < interval.endRange) {
        if (interval?.child && interval.child.length > 0) {
          return this.getActiveInterval(interval.child);
        } else {
          return interval;
        }
      }
    }
    return null;
  }

  public getNextInterval() {
    const currentInterval = this.getActiveInterval(this.intervalsTree);
    if (currentInterval) {
      const siblings = currentInterval.siblings || [];
      const indx = siblings.indexOf(currentInterval);
      if (indx + 1 < siblings.length) {
        return siblings[indx + 1];
      }
    }
  }

  private getIntervalRanges(itemsSize: number, intervalSize: number, numOfIntervals: number): number [] {
    const ranges = [];
    let tempItemsSize = itemsSize;
    for (let i = 0; i < numOfIntervals; i++) {
      if (tempItemsSize > intervalSize) {
        tempItemsSize = tempItemsSize - intervalSize;
        ranges.push(intervalSize);
      } else {
        ranges.push(tempItemsSize);
      }
    }
    return ranges;
  }

  private calculateNumberOfIntervals(itemsSize: number, intervalsMap: { [x: string]: number }) {
    const values = Object.keys(intervalsMap);
    let quizListTruncateInterval = '10';
    for (let i = 0; i < values.length; i++) {
      const val: string = values[i];
      if (itemsSize <= +val) {
        quizListTruncateInterval = val;
        break;
      }
    }
    const divNumb = intervalsMap[quizListTruncateInterval];
    // return Math.ceil(itemsSize / divNumb); // itemSize can be divided into x intervals
    return {numOfIntervals: Math.ceil(itemsSize / divNumb), intervalSize: divNumb};
  }

  private emitData() {
    this.dataEmitter.next({start: this.finalRangeRow.start, end: this.finalRangeRow.end, currentQuestion: this.currentActiveQuestion});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.quizSetting.isEnabledStickyIntervalOption = false;
  }
}
