# PrimeNG Library instructions

# We use latest PrimeNG 22

**Latest PrimeNG Docs:** https://primeng.dev/

# Rules

## Rules: PrimeNG Icon Imports and Usage

### 1. Specific Icon Usage.

For specific icon usage we import prime-ng icons like that:

```typescript
import { Sort as SortIcon } from '@primeicons/angular/sort';
import { SortDown as SortDownIcon } from '@primeicons/angular/sort-down';
import { SortUp as SortUpIcon } from '@primeicons/angular/sort-up';

const PrimeNGIconImports = [
  SortIcon, SortUpIcon, SortDownIcon
];

@Component({
  imports: [
    ...PrimeNGIconImports,
  ],
})
```

template usage:

```html
<svg class="sort-icon" data-p-icon="sort" [size]="12"></svg>
<svg class="sort-icon" data-p-icon="sort-down" [size]="12"></svg>
<svg class="sort-icon" data-p-icon="sort-up" [size]="12"></svg>
```

### 2. Specific Icon Usage — Preferable Way

For specific icon usage it's better to make only 1 import, <br/>
and don't import a module for every specific icon, <br/>
since we can use 10+ icons in some single component, <br/>
and we don't need to blow up the component with unnecessary imports. <br/>
Make it like here:

```typescript
import { PIcon } from '@primeicons/angular/p-icon';

@Component({
  imports: [
    PIcon
  ],
})
```

template usage:

```html
<svg class="sort-icon" pIcon="sort" [size]="12"></svg>
<svg class="sort-icon" pIcon="sort-down" [size]="12"></svg>
<svg class="sort-icon" pIcon="sort-up" [size]="12"></svg>
```

### 3. Dynamic Icons (or Pragramatic Icons)

If we need a dynamic icon dependent on some value, we use [pIcon] directive, like here:

```typescript
import { PIcon } from '@primeicons/angular/p-icon';

const PrimeNGIconImports = [];

@Component({
  imports: [
    PIcon
  ],
})
```

template usage:

```html
<svg class="sort-icon" [pIcon]="getSortIconName('firstName')" [size]="12"></svg>
```
