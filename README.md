# genum

> a simple tool to generate ts enum

# Getting Started

## Installation

```bash
$ npm i genum -g
```

## Usage

1. create `genum-template.json`

```bash
$ genum init
```

```json
{
  "auditStatus-审批状态": [
    {
      "label": "待审批",
      "key": "Waiting",
      "value": 1
    },
    {
      "label": "审批成功",
      "key": "Success",
      "value": 2
    }
  ]
}
```

2. update your config

3. generate your `genum-data.ts`

```bash
$ genum gen
```

```ts
/** 审批状态枚举定义 */
export enum AuditStatusEnum {
  /** 待审批 */
  Waiting = 1,
  /** 审批成功 */
  Success = 2,
}

/** 审批状态Map */
export const auditStatusMap = {
  [AuditStatusEnum.Waiting]: '待审批',
  [AuditStatusEnum.Success]: '审批成功',
}

/** 审批状态List */
export const auditStatusList = [
  {
    label: '待审批',
    value: AuditStatusEnum.Waiting,
  },
  {
    label: '审批成功',
    value: AuditStatusEnum.Success,
  },
]
```

## Options

```bash
Usage: genum <command> [options]

Options:
  -v, --version output the current version
  -h, --help    display help for command

Commands:
  init [options]  create a configure template in given directory
  gen [options]   generate enum
  help [command]  display help for command

```

# LICENSE

[MIT](https://///blob/master/LICENSE)
