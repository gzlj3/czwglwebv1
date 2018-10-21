﻿DROP TABLE  IF EXISTS `house`;
CREATE TABLE `house` (
  `houseid` varchar(32) NOT NULL COMMENT '房屋ID',
  `yzhid` varchar(32) NOT NULL COMMENT '云租户ID',
  `fwmc` varchar(20) NOT NULL COMMENT '房屋名称',
  `zhxm` varchar(50) DEFAULT NULL COMMENT '租户姓名',
  `sfzh` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `dhhm` varchar(50) DEFAULT NULL COMMENT '电话号码',
  `czje` int(11) DEFAULT NULL COMMENT '出租金额',
  `yj` int(11) DEFAULT NULL COMMENT '押金',
  `htrqq` date DEFAULT NULL COMMENT '合同日期起',
  `htrqz` date DEFAULT NULL COMMENT '合同日期止',
  `szrq` date DEFAULT NULL COMMENT '下次收租日期',
  `dscds` int(11) DEFAULT NULL COMMENT '电上次读数',
  `dbcds` int(11) DEFAULT NULL COMMENT '电本次读数',
  `dgtds` int(11) DEFAULT NULL COMMENT '电公摊度数',
  `ddj` decimal(5,2) DEFAULT NULL COMMENT '电单价',
  `sscds` int(11) DEFAULT NULL COMMENT '水上次读数',
  `sbcds` int(11) DEFAULT NULL COMMENT '水本次读数',
  `sgtds` int(11) DEFAULT NULL COMMENT '水公摊度数',
  `sdj` decimal(5,2) DEFAULT NULL COMMENT '水单价',
  `wlf` int(11) DEFAULT NULL COMMENT '网络费',
  `glf` int(11) DEFAULT NULL COMMENT '管理费',
  `ljf` int(11) DEFAULT NULL COMMENT '垃圾费',
  `syjzf` decimal(10,2) DEFAULT NULL COMMENT '上月结转费',
  `qtf` decimal(10,2) DEFAULT NULL COMMENT '其它费',
  `sfsz` varchar(1) DEFAULT NULL COMMENT '是否收租(0:未收，1:已收)',
  `bz` varchar(500) DEFAULT NULL COMMENT '备注',
  `fy1` decimal(10,2) DEFAULT NULL COMMENT '备用费用1',
  `fy2` decimal(10,2) DEFAULT NULL COMMENT '备用费用2',
  `fy3` decimal(10,2) DEFAULT NULL COMMENT '备用费用3',
  `fy4` decimal(10,2) DEFAULT NULL COMMENT '备用费用4',
  `fy5` decimal(10,2) DEFAULT NULL COMMENT '备用费用5',
  `by1` varchar(50) DEFAULT NULL COMMENT '备用1',
  `by2` varchar(50) DEFAULT NULL COMMENT '备用2',
  `by3` varchar(50) DEFAULT NULL COMMENT '备用3',
  `by4` varchar(50) DEFAULT NULL COMMENT '备用4',
  `by5` varchar(50) DEFAULT NULL COMMENT '备用5',
  PRIMARY KEY (`houseid`),
  UNIQUE KEY `ind_fwmc` (`yzhid`,`fwmc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE  IF EXISTS `housefy`;
CREATE TABLE `housefy` (
  `housefyid` varchar(32) NOT NULL COMMENT '房屋费用表ID',
  `houseid` varchar(32) NOT NULL COMMENT '房屋ID',
  `fwmc` varchar(20) NOT NULL COMMENT '房屋名称',
  `zhxm` varchar(50) DEFAULT NULL COMMENT '租户姓名',
  `rq1` date DEFAULT NULL COMMENT '收租日期起',
  `rq2` date DEFAULT NULL COMMENT '收租日期止',
  `dscds` int(11) DEFAULT NULL COMMENT '电上次读数',
  `dbcds` int(11) DEFAULT NULL COMMENT '电本次读数',
  `dgtds` int(11) DEFAULT NULL COMMENT '电公摊度数',
  `ddj` decimal(5,2) DEFAULT NULL COMMENT '电单价',
  `sscds` int(11) DEFAULT NULL COMMENT '水上次读数',
  `sbcds` int(11) DEFAULT NULL COMMENT '水本次读数',
  `sgtds` int(11) DEFAULT NULL COMMENT '水公摊度数',
  `sdj` decimal(5,2) DEFAULT NULL COMMENT '水单价',
  `wlf` int(11) DEFAULT NULL COMMENT '网络费',
  `glf` int(11) DEFAULT NULL COMMENT '管理费',
  `ljf` int(11) DEFAULT NULL COMMENT '垃圾费',
  `syjzf` decimal(10,2) DEFAULT NULL COMMENT '上月结转费',
  `qtf` decimal(10,2) DEFAULT NULL COMMENT '其它费',
  `czje` int(11) DEFAULT NULL COMMENT '房租费',
  `sfsz` varchar(1) DEFAULT NULL COMMENT '是否收租(0:未收,1:已收)',
  `szrq` date DEFAULT NULL COMMENT '下次收租日期',
  `bz` varchar(500) DEFAULT NULL COMMENT '备注',
  `fy1` decimal(10,2) DEFAULT NULL COMMENT '备用费用1',
  `fy2` decimal(10,2) DEFAULT NULL COMMENT '备用费用2',
  `fy3` decimal(10,2) DEFAULT NULL COMMENT '备用费用3',
  `fy4` decimal(10,2) DEFAULT NULL COMMENT '备用费用4',
  `fy5` decimal(10,2) DEFAULT NULL COMMENT '备用费用5',
  `by1` varchar(50) DEFAULT NULL COMMENT '备用1',
  `by2` varchar(50) DEFAULT NULL COMMENT '备用2',
  `by3` varchar(50) DEFAULT NULL COMMENT '备用3',
  `by4` varchar(50) DEFAULT NULL COMMENT '备用4',
  `by5` varchar(50) DEFAULT NULL COMMENT '备用5',
  PRIMARY KEY (`housefyid`),
  KEY `ind_houseid_rq12` (`houseid`,`rq1`,`rq2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
