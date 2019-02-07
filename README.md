# asset-admin
一个基于iview-admin的前端ui及node后端express框架开发的个人资产管理的后台系统，实现个人记账及资产管理功能为主，冗余代码量较多，可针对个人消费及收入等特点进行修改，以对个人资产收支情况、组成情况等有一定的了解，从而有计划且理性地消费、理财。

## 一、进入server安装依赖并启动：
`cd server`
<br>`npm i`
<br>`npm run dev`

## 二、进入web安装依赖并启动：
`cd web`
<br>`npm i`
<br>`npm run dev`

## 三、页面展示：
### 1.新建资产
新建个人资产（资金总和若为0默认报错），选择所属载体、选择是否信用卡类，选择具体模块，新建后随时可编辑，可重新修正对应资金和对应日期，但**注意资金选择对应时间默认为当天零点，若当天有记账则会在此基础上进行记账，若当天已完成所有记账且想修正当前资产数据，时间可选择后一天**
![新建资产](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/new-asset.gif)
### 2.资产模块分类
可按个人习惯进行模块大类细分，在统计图表中的资产概览可看分类组成情况
![资产模块分类](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/asset-classify.gif)
### 3.支出大项分类
可按个人习惯进行支出大项细分，在记账管理的列表中可查看每条支出记账的所属分类
![支出大项分类](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/spend-classify.gif)
### 4.记账
建议此处作回归记账，每天记账前一天（或者其他之前的账单）的，且时间范围限制了当前年初到今天才可选择
![记账](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/charge.gif)
### 5.增加记账计划实现定期记账
可按一定周期自动记账，不用每次记账，新建计划后，可在未来账单中修改某些特定的时间或金额
![增加记账计划实现定期记账](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/charge-plan.gif)
### 6.查看资产分类和细项组成情况
![查看资产分类和细项组成情况](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/asset-proportion.gif)
### 7.查看月份收支情况
![查看月份收支情况](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/earn-spend-overview.gif)
### 8.查看首页总览情况
![查看首页总览情况](https://raw.githubusercontent.com/ershing/asset-admin/master/gifs/home.gif)
