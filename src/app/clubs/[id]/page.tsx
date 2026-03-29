"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWishlist } from "@/components/WishlistContext";

// 社团核心成员数据（公开可见）
const membersData: Record<number, {name:string;role:string;avatar:string;grade:string;contact:string}[]> = {
  13: [ // 代码创想社
    { name: "陈明轩", role: "社长", avatar: "👨‍💻", grade: "大三·计算机", contact: "wx: chenxuan_dev" },
    { name: "林小雨", role: "副社长", avatar: "👩‍💻", grade: "大三·软件工程", contact: "wx: linxy_code" },
    { name: "张浩然", role: "技术部长", avatar: "🧑‍🔬", grade: "大二·人工智能", contact: "wx: zhhr_ai" },
    { name: "刘思琪", role: "活动策划", avatar: "📋", grade: "大二·数据科学", contact: "wx: lsq_data" },
  ],
  14: [ // 星辰摄影协会
    { name: "王艺涵", role: "社长", avatar: "📸", grade: "大三·新闻传播", contact: "wx: wyh_photo" },
    { name: "李明月", role: "副社长", avatar: "🌙", grade: "大三·视觉设计", contact: "wx: limy_design" },
    { name: "赵天宇", role: "外拍组长", avatar: "🏞️", grade: "大二·广告学", contact: "wx: zty_lens" },
  ],
  15: [ // 风华辩论社
    { name: "孙博文", role: "社长", avatar: "⚖️", grade: "大三·法学", contact: "wx: sbw_debate" },
    { name: "周雨萱", role: "副社长", avatar: "🎤", grade: "大三·哲学", contact: "wx: zyx_think" },
    { name: "吴子轩", role: "辩论教练", avatar: "📚", grade: "大二·政治学", contact: "wx: wzx_logic" },
  ],
  16: [ // 绿芽志愿者协会
    { name: "郑心怡", role: "会长", avatar: "🌱", grade: "大三·社会工作", contact: "wx: zxy_green" },
    { name: "吴佳琪", role: "副会长", avatar: "💚", grade: "大三·护理学", contact: "wx: wjq_care" },
    { name: "刘晓峰", role: "支教组长", avatar: "📖", grade: "大二·教育学", contact: "wx: lxf_teach" },
    { name: "黄雨涵", role: "环保组长", avatar: "🌿", grade: "大二·环境科学", contact: "wx: hyh_eco" },
  ],
  17: [ // 篮球俱乐部
    { name: "马超群", role: "队长", avatar: "🏀", grade: "大三·体育教育", contact: "wx: mcq_ball" },
    { name: "黄子健", role: "副队长", avatar: "💪", grade: "大三·金融学", contact: "wx: hzj_hoop" },
    { name: "陈国栋", role: "训练组长", avatar: "🏃", grade: "大二·运动训练", contact: "wx: cgd_train" },
  ],
  18: [ // 墨韵书法社
    { name: "林墨白", role: "社长", avatar: "🖌️", grade: "大三·中文", contact: "wx: lmb_ink" },
    { name: "何雅琴", role: "副社长", avatar: "📜", grade: "大三·历史学", contact: "wx: hyq_brush" },
  ],
  19: [ // 创行创业社
    { name: "高远航", role: "社长", avatar: "🚀", grade: "大四·工商管理", contact: "wx: gyh_startup" },
    { name: "梁思思", role: "副社长", avatar: "💡", grade: "大三·市场营销", contact: "wx: lss_biz" },
    { name: "徐浩天", role: "项目组长", avatar: "📊", grade: "大二·金融学", contact: "wx: xht_project" },
  ],
  20: [ // 旋律吉他社
    { name: "杨逸风", role: "社长", avatar: "🎸", grade: "大三·音乐学", contact: "wx: yyf_guitar" },
    { name: "谢雨桐", role: "副社长", avatar: "🎵", grade: "大二·英语", contact: "wx: xyt_melody" },
    { name: "方子涵", role: "民谣组长", avatar: "🎶", grade: "大二·中文", contact: "wx: fzh_folk" },
  ],
  21: [ // 模拟联合国协会
    { name: "罗天成", role: "秘书长", avatar: "🌍", grade: "大三·国际关系", contact: "wx: ltc_mun" },
    { name: "唐诗琪", role: "副秘书长", avatar: "🏛️", grade: "大三·外交学", contact: "wx: tsq_diplo" },
  ],
  22: [ // 极限运动社
    { name: "韩凌风", role: "社长", avatar: "🛹", grade: "大三·土木工程", contact: "wx: hlf_skate" },
    { name: "冯天宇", role: "副社长", avatar: "🧗", grade: "大二·机械工程", contact: "wx: fty_climb" },
  ],
  23: [ // 心理健康协会
    { name: "邱心怡", role: "会长", avatar: "🧠", grade: "大三·心理学", contact: "wx: qxy_mind" },
    { name: "余佳慧", role: "副会长", avatar: "💭", grade: "大二·教育学", contact: "wx: yjh_psy" },
  ],
  24: [ // ACG动漫社
    { name: "田梦蝶", role: "社长", avatar: "🎌", grade: "大三·动画", contact: "wx: tmd_acg" },
    { name: "任星辰", role: "副社长", avatar: "✨", grade: "大二·日语", contact: "wx: rxc_anime" },
    { name: "沈画画", role: "Cosplay组长", avatar: "🎭", grade: "大二·服装设计", contact: "wx: shh_cos" },
  ],
  25: [ // 足球联盟
    { name: "刘强", role: "队长", avatar: "⚽", grade: "大三·体育教育", contact: "wx: lq_football" },
    { name: "张铭宇", role: "副队长", avatar: "🏃", grade: "大二·金融学", contact: "wx: zmy_kick" },
    { name: "王浩", role: "守门员组长", avatar: "🧤", grade: "大二·机械工程", contact: "wx: wh_goal" },
  ],
  26: [ // 羽毛球协会
    { name: "陈雅婷", role: "会长", avatar: "🏸", grade: "大三·新闻学", contact: "wx: cyt_badminton" },
    { name: "李思远", role: "副会长", avatar: "🏅", grade: "大二·经济学", contact: "wx: lsy_smash" },
  ],
  27: [ // 话剧团
    { name: "周梦瑶", role: "团长", avatar: "🎭", grade: "大三·戏剧影视", contact: "wx: zmy_drama" },
    { name: "赵子涵", role: "副团长", avatar: "🎬", grade: "大三·中文", contact: "wx: zzh_stage" },
    { name: "孙艺萱", role: "编剧组长", avatar: "✍️", grade: "大二·汉语言", contact: "wx: syx_script" },
  ],
  28: [ // 街舞社
    { name: "吴天翔", role: "社长", avatar: "💃", grade: "大三·舞蹈学", contact: "wx: wtx_dance" },
    { name: "何雨桐", role: "副社长", avatar: "🕺", grade: "大二·表演", contact: "wx: hyt_hiphop" },
  ],
  29: [ // 天文爱好者协会
    { name: "方星河", role: "会长", avatar: "🔭", grade: "大三·物理学", contact: "wx: fxh_star" },
    { name: "许月明", role: "观测组长", avatar: "🌙", grade: "大二·天文学", contact: "wx: xym_moon" },
  ],
  30: [ // 数学建模协会
    { name: "张博远", role: "会长", avatar: "📐", grade: "大三·数学", contact: "wx: zby_math" },
    { name: "李文静", role: "副会长", avatar: "📊", grade: "大三·统计学", contact: "wx: lwj_model" },
    { name: "陈智远", role: "竞赛组长", avatar: "🏆", grade: "大二·应用数学", contact: "wx: czy_algo" },
  ],
  31: [ // 英语演讲与辩论社
    { name: "林安琪", role: "社长", avatar: "🗣️", grade: "大三·英语", contact: "wx: laq_speech" },
    { name: "赵伟豪", role: "辩论组长", avatar: "🎤", grade: "大二·翻译", contact: "wx: zwh_debate" },
  ],
  32: [ // 机器人创新工坊
    { name: "黄启明", role: "社长", avatar: "🤖", grade: "大三·自动化", contact: "wx: hqm_robot" },
    { name: "周涛", role: "硬件组长", avatar: "🔧", grade: "大二·电子工程", contact: "wx: zt_hardware" },
    { name: "王雪纯", role: "编程组长", avatar: "💻", grade: "大二·计算机", contact: "wx: wxc_code" },
  ],
  33: [ // 读书会
    { name: "苏子墨", role: "会长", avatar: "📚", grade: "大三·哲学", contact: "wx: szm_read" },
    { name: "何书瑶", role: "副会长", avatar: "📖", grade: "大二·中文", contact: "wx: hsy_book" },
  ],
  34: [ // 电影协会
    { name: "钱思远", role: "会长", avatar: "🎬", grade: "大三·广播电视", contact: "wx: qsy_film" },
    { name: "徐佳怡", role: "影评组长", avatar: "🎞️", grade: "大二·新闻学", contact: "wx: xjy_cinema" },
  ],
  35: [ // 汉服社
    { name: "宋雅萱", role: "社长", avatar: "👘", grade: "大三·历史学", contact: "wx: syx_hanfu" },
    { name: "陈婉清", role: "副社长", avatar: "🏮", grade: "大二·服装设计", contact: "wx: cwq_style" },
  ],
  36: [ // 桌游社
    { name: "郭子豪", role: "社长", avatar: "🎲", grade: "大三·数学", contact: "wx: gzh_board" },
    { name: "刘思彤", role: "副社长", avatar: "🃏", grade: "大二·心理学", contact: "wx: lst_game" },
  ],
  37: [ // 瑜伽社
    { name: "林诗语", role: "社长", avatar: "🧘", grade: "大三·体育教育", contact: "wx: lsy_yoga" },
    { name: "张悦", role: "副社长", avatar: "🌸", grade: "大二·护理学", contact: "wx: zy_zen" },
  ],
  38: [ // 跑步爱好者协会
    { name: "王奔", role: "会长", avatar: "🏃", grade: "大三·运动训练", contact: "wx: wb_run" },
    { name: "杨帆", role: "马拉松组长", avatar: "🏅", grade: "大二·公共管理", contact: "wx: yf_marathon" },
  ],
  39: [ // 乒乓球社
    { name: "孙文杰", role: "社长", avatar: "🏓", grade: "大三·体育教育", contact: "wx: swj_pingpong" },
    { name: "陈小敏", role: "副社长", avatar: "🏆", grade: "大二·会计学", contact: "wx: cxm_table" },
  ],
  40: [ // 合唱团
    { name: "刘雨欣", role: "团长", avatar: "🎵", grade: "大三·音乐学", contact: "wx: lyx_chorus" },
    { name: "张恩华", role: "指挥", avatar: "🎼", grade: "大三·音乐表演", contact: "wx: zeh_conduct" },
    { name: "周晓彤", role: "声部组长", avatar: "🎤", grade: "大二·音乐教育", contact: "wx: zxt_voice" },
  ],
  41: [ // 美食研究社
    { name: "田美琪", role: "社长", avatar: "🍳", grade: "大三·食品科学", contact: "wx: tmq_food" },
    { name: "罗小厨", role: "副社长", avatar: "👨‍🍳", grade: "大二·酒店管理", contact: "wx: lxc_cook" },
  ],
  42: [ // 法律援助中心
    { name: "杨正义", role: "主任", avatar: "⚖️", grade: "大三·法学", contact: "wx: yzy_law" },
    { name: "陈思萍", role: "副主任", avatar: "📋", grade: "大三·法律", contact: "wx: csp_legal" },
  ],
  43: [ // 环保行动社
    { name: "林碧水", role: "社长", avatar: "♻️", grade: "大三·环境科学", contact: "wx: lbs_eco" },
    { name: "张森", role: "副社长", avatar: "🌿", grade: "大二·环境工程", contact: "wx: zs_green" },
  ],
  44: [ // 支教筑梦团
    { name: "何春阳", role: "团长", avatar: "📖", grade: "大三·教育学", contact: "wx: hcy_teach" },
    { name: "刘心怡", role: "副团长", avatar: "🌈", grade: "大二·小学教育", contact: "wx: lxy_dream" },
    { name: "马志远", role: "后勤组长", avatar: "📦", grade: "大二·管理学", contact: "wx: mzy_support" },
  ],
  45: [ // 金融投资俱乐部
    { name: "吴金辰", role: "社长", avatar: "📈", grade: "大三·金融学", contact: "wx: wjc_invest" },
    { name: "黄盈盈", role: "分析组长", avatar: "📊", grade: "大二·经济学", contact: "wx: hyy_finance" },
  ],
  46: [ // 新媒体运营社
    { name: "赵小编", role: "社长", avatar: "📱", grade: "大三·传播学", contact: "wx: zxb_media" },
    { name: "刘妙笔", role: "内容组长", avatar: "✍️", grade: "大二·广告学", contact: "wx: lmb_content" },
  ],
  47: [ // 电竞社
    { name: "陈战神", role: "社长", avatar: "🎮", grade: "大三·计算机", contact: "wx: czs_esport" },
    { name: "李风暴", role: "副社长", avatar: "⚡", grade: "大二·软件工程", contact: "wx: lfb_game" },
    { name: "王操作", role: "战队队长", avatar: "🏆", grade: "大二·电竞", contact: "wx: wcz_team" },
  ],
  48: [ // 日语学习社
    { name: "小林美穗", role: "社长", avatar: "🇯🇵", grade: "大三·日语", contact: "wx: xlmh_nihon" },
    { name: "田中诚", role: "副社长", avatar: "📝", grade: "大二·日语", contact: "wx: tzc_jpn" },
  ],
  49: [ // 手工创意工坊
    { name: "刘巧手", role: "社长", avatar: "✂️", grade: "大三·工业设计", contact: "wx: lqs_craft" },
    { name: "陈艺心", role: "副社长", avatar: "🎀", grade: "大二·视觉设计", contact: "wx: cyx_diy" },
  ],
  50: [ // 辩证思维协会
    { name: "孔明哲", role: "会长", avatar: "🧩", grade: "大三·哲学", contact: "wx: kmz_think" },
    { name: "诸葛慧", role: "副会长", avatar: "💡", grade: "大二·逻辑学", contact: "wx: zgh_logic" },
  ],
  51: [ // 国际文化交流协会
    { name: "白乐天", role: "会长", avatar: "🌐", grade: "大三·国际关系", contact: "wx: blt_global" },
    { name: "Sarah Chen", role: "副会长", avatar: "🗺️", grade: "大二·英语", contact: "wx: sc_culture" },
  ],
  52: [ // 游泳社
    { name: "江海洋", role: "社长", avatar: "🏊", grade: "大三·体育教育", contact: "wx: jhy_swim" },
    { name: "李清波", role: "副社长", avatar: "🌊", grade: "大二·运动训练", contact: "wx: lqb_pool" },
  ],
  53: [ // 设计师联盟
    { name: "陆艺凡", role: "社长", avatar: "🎨", grade: "大三·视觉传达", contact: "wx: lyf_design" },
    { name: "程墨白", role: "副社长", avatar: "✏️", grade: "大二·工业设计", contact: "wx: cmb_ui" },
    { name: "温思颖", role: "UI组长", avatar: "💻", grade: "大二·数字媒体", contact: "wx: wsy_pixel" },
  ],
};

interface Club { id:number; name:string; category:string; description:string; tags:string; logo:string; contactInfo:string; memberCount:number; requirements:string; }

// 往届学长学姐评价数据
const reviewsData: Record<number, {name:string;grade:string;avatar:string;rating:number;date:string;content:string;tags:string[]}[]> = {
  13: [ // 代码创想社
    { name: "张同学", grade: "大三·计算机", avatar: "👨‍💻", rating: 5, date: "2025-12", content: "大一加入的，从零基础到能独立做项目，社团的技术氛围特别好。每周的code review让我成长很快，强烈推荐给对编程感兴趣的同学！", tags: ["技术氛围好", "学到很多"] },
    { name: "李同学", grade: "大二·软件工程", avatar: "👩‍💻", rating: 5, date: "2025-11", content: "黑客马拉松太刺激了！和队友熬夜写代码的经历是大学最难忘的回忆。社长和学长都很耐心，有问题随时可以问。", tags: ["活动丰富", "氛围友好"] },
    { name: "王同学", grade: "大四·数据科学", avatar: "🧑‍🔬", rating: 4, date: "2025-09", content: "社团项目经历在找实习的时候帮了大忙，面试官对我们的开源项目很感兴趣。唯一不足是有时候活动时间和课程冲突。", tags: ["对就业有帮助", "项目经验"] },
  ],
  14: [ // 星辰摄影协会
    { name: "陈同学", grade: "大三·新闻传播", avatar: "📸", rating: 5, date: "2025-12", content: "从手机拍照小白到能用相机拍出好照片，全靠社团的外拍活动和后期课。每次出去采风都超开心！", tags: ["零基础友好", "外拍好玩"] },
    { name: "赵同学", grade: "大二·视觉设计", avatar: "🎨", rating: 5, date: "2025-10", content: "摄影展是我大学最有成就感的时刻，看到自己的作品被展出真的很感动。社团氛围很温馨，像一个大家庭。", tags: ["有成就感", "温馨"] },
  ],
  15: [ // 风华辩论社
    { name: "孙同学", grade: "大三·法学", avatar: "⚖️", rating: 5, date: "2025-11", content: "辩论社彻底改变了我的表达能力和思维方式。现在不管是课堂展示还是面试，都比以前自信多了。", tags: ["提升表达", "锻炼思维"] },
    { name: "周同学", grade: "大二·哲学", avatar: "🤔", rating: 4, date: "2025-10", content: "思想碰撞的感觉太爽了！每次辩论赛准备虽然辛苦，但真的能学到很多不同角度的思考方式。", tags: ["思维提升", "有挑战"] },
  ],
  16: [ // 绿芽志愿者协会
    { name: "吴同学", grade: "大三·社会工作", avatar: "🌱", rating: 5, date: "2025-12", content: "去山区支教的那个暑假改变了我的人生方向。孩子们的笑容让我觉得一切付出都值得，也认识了一群有爱的伙伴。", tags: ["改变人生", "有爱"] },
    { name: "郑同学", grade: "大二·护理学", avatar: "💚", rating: 5, date: "2025-11", content: "每次去敬老院都很有收获，老人们特别可爱。社团组织很有条理，活动安排合理，不会影响学习。", tags: ["有意义", "安排合理"] },
    { name: "刘同学", grade: "大四·公共管理", avatar: "🤝", rating: 5, date: "2025-09", content: "三年志愿经历让我的简历亮了不少，更重要的是收获了责任感和同理心。绿芽是我大学最正确的选择！", tags: ["简历加分", "收获成长"] },
  ],
  17: [ // 篮球俱乐部
    { name: "马同学", grade: "大三·体育教育", avatar: "🏀", rating: 5, date: "2025-11", content: "每周训练让我球技进步飞快，教练很专业。校际联赛拿了亚军，那种团队一起拼搏的感觉太棒了！", tags: ["球技提升", "团队精神"] },
    { name: "黄同学", grade: "大二·金融学", avatar: "💪", rating: 4, date: "2025-10", content: "零基础加入的，现在已经能上场打比赛了。社团氛围很好，男女都有，不会排外。就是训练有时候有点累哈哈。", tags: ["零基础可加入", "氛围好"] },
  ],
  18: [ // 墨韵书法社
    { name: "林同学", grade: "大三·中文", avatar: "🖌️", rating: 5, date: "2025-12", content: "练字让我内心变得很平静，每周的书法课是我最期待的时光。老师是书法家协会的，教得特别好。", tags: ["修身养性", "老师专业"] },
    { name: "何同学", grade: "大二·历史学", avatar: "📜", rating: 5, date: "2025-10", content: "零基础入门，现在行书已经写得有模有样了。春节给家人写春联，他们都惊呆了！", tags: ["零基础友好", "有成就感"] },
  ],
  19: [ // 创行创业社
    { name: "高同学", grade: "大四·工商管理", avatar: "🚀", rating: 5, date: "2025-11", content: "在社团里认识了我的创业合伙人，我们的项目还拿了互联网+省赛银奖。资源和人脉都是真的好。", tags: ["资源丰富", "人脉广"] },
    { name: "梁同学", grade: "大三·市场营销", avatar: "💡", rating: 4, date: "2025-10", content: "创业导师分享会让我开了眼界，从商业计划书到路演全流程都能学到。就是有时候需要投入比较多时间。", tags: ["开阔眼界", "实践性强"] },
  ],
  20: [ // 旋律吉他社
    { name: "杨同学", grade: "大三·音乐学", avatar: "🎸", rating: 5, date: "2025-12", content: "从完全不会弹到能在校园音乐节表演，吉他社给了我一个舞台。社团里各种风格的人都有，很有意思。", tags: ["从零到表演", "风格多样"] },
    { name: "谢同学", grade: "大二·英语", avatar: "🎵", rating: 5, date: "2025-11", content: "最喜欢每周的弹唱会，大家围坐在一起唱歌的感觉太美好了。社长人超好，教得很有耐心。", tags: ["氛围温馨", "耐心教学"] },
  ],
  21: [ // 模拟联合国协会
    { name: "罗同学", grade: "大三·国际关系", avatar: "🌍", rating: 5, date: "2025-11", content: "参加全国模联大会的经历让我的英语口语和国际视野都提升了一大截。认识了很多优秀的同学。", tags: ["提升英语", "开阔视野"] },
    { name: "唐同学", grade: "大二·外交学", avatar: "🏛️", rating: 4, date: "2025-10", content: "准备立场文件虽然辛苦，但会议上发言的成就感无与伦比。需要一定的英语基础，建议先提升再加入。", tags: ["有挑战", "成就感强"] },
  ],
  22: [ // 极限运动社
    { name: "韩同学", grade: "大三·土木工程", avatar: "🛹", rating: 5, date: "2025-12", content: "滑板从零开始学，摔了无数次但现在能做各种动作了。社团安全措施做得很好，教练很负责。", tags: ["安全保障", "挑战自我"] },
    { name: "冯同学", grade: "大二·机械工程", avatar: "🧗", rating: 5, date: "2025-10", content: "攀岩太刺激了！每次突破自己的高度都超有成就感。社团的人都很热血，周末一起出去玩特别开心。", tags: ["刺激有趣", "热血青春"] },
  ],
  23: [ // 心理健康协会
    { name: "邱同学", grade: "大三·心理学", avatar: "🧠", rating: 5, date: "2025-11", content: "心理沙龙让我更了解自己了，团体辅导的体验也很棒。社团氛围温暖包容，是我压力大时的避风港。", tags: ["了解自我", "温暖包容"] },
    { name: "余同学", grade: "大二·教育学", avatar: "💭", rating: 5, date: "2025-10", content: "不是心理学专业也完全能参与！学到的沟通技巧在生活中特别实用，推荐每个人都来体验一下。", tags: ["实用技巧", "不限专业"] },
  ],
  24: [ // ACG动漫社
    { name: "田同学", grade: "大三·动画", avatar: "🎌", rating: 5, date: "2025-12", content: "终于找到组织了！社团里都是同好，漫展cosplay超级开心。每周的动漫观影会是我最期待的时光。", tags: ["找到组织", "同好多"] },
    { name: "任同学", grade: "大二·日语", avatar: "✨", rating: 5, date: "2025-11", content: "声优大赛太有意思了，虽然没得奖但认识了好多有才华的朋友。社团对各种ACG领域都很包容。", tags: ["活动有趣", "包容性强"] },
  ],
  25: [ // 足球联盟
    { name: "刘同学", grade: "大三·体育教育", avatar: "⚽", rating: 5, date: "2025-12", content: "校队氛围超棒，每周训练让我球技突飞猛进。校际联赛的团队拼搏感让人热血沸腾！", tags: ["球技提升", "热血团队"] },
    { name: "张同学", grade: "大二·金融学", avatar: "🏃", rating: 4, date: "2025-10", content: "零基础也完全没问题，学长们都很照顾新人。周末踢球是我最解压的时光。", tags: ["零基础友好", "解压好去处"] },
  ],
  26: [ // 羽毛球协会
    { name: "陈同学", grade: "大三·新闻学", avatar: "🏸", rating: 5, date: "2025-11", content: "从随便打着玩到现在能参加校赛，进步超大！教练很专业，每周的训练安排也很科学。", tags: ["进步明显", "训练科学"] },
    { name: "李同学", grade: "大二·经济学", avatar: "🏅", rating: 4, date: "2025-10", content: "社团气氛轻松，不管什么水平都能找到对手。周末约球已经成了习惯。", tags: ["氛围轻松", "各水平适合"] },
  ],
  27: [ // 话剧团
    { name: "周同学", grade: "大三·戏剧影视", avatar: "🎭", rating: 5, date: "2025-12", content: "站在舞台上的感觉太好了！从排练到公演，整个过程让我收获了自信和友谊。", tags: ["提升自信", "难忘体验"] },
    { name: "赵同学", grade: "大二·中文", avatar: "🎬", rating: 5, date: "2025-11", content: "不需要表演经验！我是编剧组的，写剧本的过程特别有创造力。每次看到自己的作品被演出来超感动。", tags: ["创造力强", "不限经验"] },
  ],
  28: [ // 街舞社
    { name: "吴同学", grade: "大三·舞蹈学", avatar: "💃", rating: 5, date: "2025-12", content: "Breaking从零学起，现在已经能上台battle了。社团的舞蹈风格很多元，Popping、Locking都有。", tags: ["风格多元", "从零到台上"] },
    { name: "何同学", grade: "大二·表演", avatar: "🕺", rating: 5, date: "2025-10", content: "校园晚会的齐舞表演是最高光的时刻！大家一起排练虽然辛苦但超有成就感。", tags: ["高光时刻", "团队默契"] },
  ],
  29: [ // 天文爱好者协会
    { name: "方同学", grade: "大三·物理学", avatar: "🔭", rating: 5, date: "2025-11", content: "第一次用望远镜看到土星环的时候真的震撼了！夜间观星活动是最浪漫的社团活动。", tags: ["震撼体验", "浪漫观星"] },
    { name: "许同学", grade: "大二·天文学", avatar: "🌙", rating: 4, date: "2025-10", content: "天文知识讲座很有趣，科普做得很好。就是观星活动有时要看天气，被放鸽子过几次。", tags: ["科普有趣", "看天气"] },
  ],
  30: [ // 数学建模协会
    { name: "张同学", grade: "大三·数学", avatar: "📐", rating: 5, date: "2025-12", content: "美赛拿了M奖，全靠社团的系统培训和模拟赛练习。对想参加建模竞赛的同学强烈推荐！", tags: ["竞赛成绩好", "培训系统"] },
    { name: "李同学", grade: "大二·统计学", avatar: "📊", rating: 5, date: "2025-10", content: "学到了MATLAB和Python数据分析，这些技能在课程和实习中都用得上。学长带队特别负责。", tags: ["实用技能", "学长负责"] },
  ],
  31: [ // 英语演讲与辩论社
    { name: "林同学", grade: "大三·英语", avatar: "🗣️", rating: 5, date: "2025-11", content: "英语口语从不敢开口到能参加全国赛，社团功不可没。每周的即兴演讲训练真的有效！", tags: ["口语飞跃", "训练有效"] },
    { name: "赵同学", grade: "大二·翻译", avatar: "🎤", rating: 4, date: "2025-10", content: "辩论赛准备过程虽然压力大，但英语思辨能力提升太多了。社团里英语大神很多，跟着学就对了。", tags: ["思辨提升", "大神带飞"] },
  ],
  32: [ // 机器人创新工坊
    { name: "黄同学", grade: "大三·自动化", avatar: "🤖", rating: 5, date: "2025-12", content: "从零搭建机器人到参加RoboMaster，社团提供的器材和指导都是顶级的。工科生必加！", tags: ["器材顶级", "工科必加"] },
    { name: "周同学", grade: "大二·电子工程", avatar: "🔧", rating: 5, date: "2025-10", content: "焊电路板、写嵌入式代码、3D打印样件，动手能力直线上升。找实习时项目经历很加分。", tags: ["动手能力强", "实习加分"] },
  ],
  33: [ // 读书会
    { name: "苏同学", grade: "大三·哲学", avatar: "📚", rating: 5, date: "2025-11", content: "每月的主题阅读让我养成了读书习惯，读后分享会上大家的观点碰撞特别有启发。", tags: ["养成习惯", "思想碰撞"] },
    { name: "何同学", grade: "大二·中文", avatar: "📖", rating: 4, date: "2025-10", content: "氛围很安静温馨，适合喜欢独处又想找同好的人。书单推荐质量很高，涵盖文史哲社科。", tags: ["安静温馨", "书单优质"] },
  ],
  34: [ // 电影协会
    { name: "钱同学", grade: "大三·广播电视", avatar: "🎬", rating: 5, date: "2025-12", content: "每周的观影交流会让我对电影的理解深了很多。社团还组织拍微电影，从编剧到剪辑全流程体验！", tags: ["深度观影", "实践拍摄"] },
    { name: "徐同学", grade: "大二·新闻学", avatar: "🎞️", rating: 5, date: "2025-10", content: "影评写作能力提升很大，还投稿发表了！社团里都是真正爱电影的人，聊起来特别投机。", tags: ["写作提升", "志同道合"] },
  ],
  35: [ // 汉服社
    { name: "宋同学", grade: "大三·历史学", avatar: "👘", rating: 5, date: "2025-11", content: "穿着汉服参加花朝节活动，感觉穿越了！社团科普了很多服饰文化知识，不只是穿好看。", tags: ["文化传承", "活动有仪式感"] },
    { name: "陈同学", grade: "大二·服装设计", avatar: "🏮", rating: 5, date: "2025-10", content: "学到了很多传统手工艺，自己缝制了第一件汉服配饰！社团成员都超友好。", tags: ["手工体验", "成员友好"] },
  ],
  36: [ // 桌游社
    { name: "郭同学", grade: "大三·数学", avatar: "🎲", rating: 5, date: "2025-12", content: "每周桌游之夜是我最期待的！从狼人杀到万智牌，各种类型都有。认识了一群特别好玩的朋友。", tags: ["游戏丰富", "朋友好玩"] },
    { name: "刘同学", grade: "大二·心理学", avatar: "🃏", rating: 4, date: "2025-10", content: "社团氛围特别轻松，来了就是玩。策略桌游锻炼了我的逻辑思维，社交桌游让我更外向了。", tags: ["氛围轻松", "锻炼思维"] },
  ],
  37: [ // 瑜伽社
    { name: "林同学", grade: "大三·体育教育", avatar: "🧘", rating: 5, date: "2025-11", content: "坚持练了一学期，体态改善特别明显，肩颈痛也好多了。老师是专业瑜伽教练，特别温柔。", tags: ["体态改善", "老师专业"] },
    { name: "张同学", grade: "大二·护理学", avatar: "🌸", rating: 5, date: "2025-10", content: "每次上完课感觉整个人都放松了，是我减压的最佳方式。零基础完全没问题。", tags: ["减压放松", "零基础友好"] },
  ],
  38: [ // 跑步爱好者协会
    { name: "王同学", grade: "大三·运动训练", avatar: "🏃", rating: 5, date: "2025-12", content: "从3公里到完成半马，社团的训练计划和陪跑让我坚持了下来。跑团氛围超正能量！", tags: ["从零到半马", "正能量"] },
    { name: "杨同学", grade: "大二·公共管理", avatar: "🏅", rating: 4, date: "2025-10", content: "早起晨跑虽然痛苦，但跑完一天都精神很好。认识了很多自律的朋友，互相激励。", tags: ["自律提升", "互相激励"] },
  ],
  39: [ // 乒乓球社
    { name: "孙同学", grade: "大三·体育教育", avatar: "🏓", rating: 5, date: "2025-11", content: "社团有专业球台和发球机，训练条件很好。从新手到能参加校赛，进步非常快。", tags: ["设备好", "进步快"] },
    { name: "陈同学", grade: "大二·会计学", avatar: "🏆", rating: 4, date: "2025-10", content: "午休时间打两局特别爽，既锻炼又解压。社团对各个水平的人都很友好。", tags: ["碎片时间", "各水平友好"] },
  ],
  40: [ // 合唱团
    { name: "刘同学", grade: "大三·音乐学", avatar: "🎵", rating: 5, date: "2025-12", content: "合唱比赛拿了省赛金奖，那种几十个人声音融为一体的感觉太震撼了！指挥老师超厉害。", tags: ["省赛金奖", "震撼体验"] },
    { name: "张同学", grade: "大二·音乐教育", avatar: "🎼", rating: 5, date: "2025-10", content: "没有声乐基础也被录取了，老师从发声开始教。新年音乐会表演是最难忘的大学记忆。", tags: ["零基础可入", "难忘回忆"] },
  ],
  41: [ // 美食研究社
    { name: "田同学", grade: "大三·食品科学", avatar: "🍳", rating: 5, date: "2025-11", content: "每周的烹饪实践课太开心了！从不会做饭到能做出一桌菜，室友都馋哭了。", tags: ["学会做饭", "实践性强"] },
    { name: "罗同学", grade: "大二·酒店管理", avatar: "👨‍🍳", rating: 5, date: "2025-10", content: "美食探店活动超赞，还能学到食品安全知识。社团氛围特别欢乐，大家一起做饭一起吃。", tags: ["探店好玩", "氛围欢乐"] },
  ],
  42: [ // 法律援助中心
    { name: "杨同学", grade: "大三·法学", avatar: "⚖️", rating: 5, date: "2025-12", content: "参与真实的法律咨询案例，比课堂学习有用多了。帮助到别人的成就感让我更坚定了学法律的决心。", tags: ["实践性强", "成就感高"] },
    { name: "陈同学", grade: "大二·法律", avatar: "📋", rating: 4, date: "2025-10", content: "模拟法庭活动很专业，指导老师是执业律师。对法考和实习都有帮助。", tags: ["专业指导", "对就业有帮助"] },
  ],
  43: [ // 环保行动社
    { name: "林同学", grade: "大三·环境科学", avatar: "♻️", rating: 5, date: "2025-11", content: "校园垃圾分类推广活动虽然辛苦，但看到校园变干净了很有成就感。社团还和企业合作做环保项目。", tags: ["有意义", "企业合作"] },
    { name: "张同学", grade: "大二·环境工程", avatar: "🌿", rating: 4, date: "2025-10", content: "植树、净滩、环保宣传，每次活动都很充实。认识了很多有环保理念的朋友。", tags: ["活动充实", "志同道合"] },
  ],
  44: [ // 支教筑梦团
    { name: "何同学", grade: "大三·教育学", avatar: "📖", rating: 5, date: "2025-12", content: "暑期支教改变了我的世界观，孩子们的纯真和求知欲让我感动落泪。这是最有价值的大学经历。", tags: ["改变世界观", "最有价值"] },
    { name: "刘同学", grade: "大二·小学教育", avatar: "🌈", rating: 5, date: "2025-10", content: "不只是教书，还帮山区学校建了图书角。团队凝聚力超强，大家为了同一个目标一起努力。", tags: ["团队凝聚力", "超越教书"] },
  ],
  45: [ // 金融投资俱乐部
    { name: "吴同学", grade: "大三·金融学", avatar: "📈", rating: 5, date: "2025-11", content: "模拟炒股大赛让我把课堂理论用到了实践，社团请的业界导师分享超有料。对想从事金融的同学特别推荐。", tags: ["理论实践", "业界资源"] },
    { name: "黄同学", grade: "大二·经济学", avatar: "📊", rating: 4, date: "2025-10", content: "财经新闻解读会让我养成了关注市场的习惯，对面试帮助很大。就是有些内容门槛稍高。", tags: ["面试有帮助", "有一定门槛"] },
  ],
  46: [ // 新媒体运营社
    { name: "赵同学", grade: "大三·传播学", avatar: "📱", rating: 5, date: "2025-12", content: "运营社团公众号粉丝从500涨到5000，这个经历让我拿到了互联网大厂实习。超实用的社团！", tags: ["实习敲门砖", "超实用"] },
    { name: "刘同学", grade: "大二·广告学", avatar: "✍️", rating: 5, date: "2025-10", content: "学会了PS、PR、小红书运营全套技能。每个人都能负责一个真实项目，不是打杂。", tags: ["技能全面", "真实项目"] },
  ],
  47: [ // 电竞社
    { name: "陈同学", grade: "大三·计算机", avatar: "🎮", rating: 5, date: "2025-12", content: "高校联赛拿了省赛冠军，和队友开黑的日子太快乐了！社团还有专业教练分析比赛录像。", tags: ["省赛冠军", "专业训练"] },
    { name: "李同学", grade: "大二·软件工程", avatar: "⚡", rating: 5, date: "2025-10", content: "不只是打游戏，还学了赛事解说和直播运营。社团活动很正规，不是网吧开黑那种。", tags: ["不止打游戏", "活动正规"] },
  ],
  48: [ // 日语学习社
    { name: "小林同学", grade: "大三·日语", avatar: "🇯🇵", rating: 5, date: "2025-11", content: "日语角的沉浸式练习比课堂有效多了，还有日本交换生来交流。N2考试一次过！", tags: ["沉浸式练习", "考级有效"] },
    { name: "田同学", grade: "大二·日语", avatar: "📝", rating: 4, date: "2025-10", content: "动漫配音活动超有趣，既练了日语又很欢乐。社团还组织日本文化体验活动。", tags: ["寓教于乐", "文化体验"] },
  ],
  49: [ // 手工创意工坊
    { name: "刘同学", grade: "大三·工业设计", avatar: "✂️", rating: 5, date: "2025-12", content: "陶艺、皮具、编织都体验了，动手做东西特别解压。作品还在学校义卖了，很有成就感！", tags: ["解压", "作品义卖"] },
    { name: "陈同学", grade: "大二·视觉设计", avatar: "🎀", rating: 5, date: "2025-10", content: "做的手工礼物送给朋友他们都超喜欢！社团提供各种材料和工具，零基础也能做出好看的作品。", tags: ["零基础友好", "材料齐全"] },
  ],
  50: [ // 辩证思维协会
    { name: "孔同学", grade: "大三·哲学", avatar: "🧩", rating: 5, date: "2025-11", content: "批判性思维训练让我看问题的角度完全不同了。小组讨论的碰撞感比辩论社更学术更深入。", tags: ["思维升级", "学术深入"] },
    { name: "诸同学", grade: "大二·逻辑学", avatar: "💡", rating: 4, date: "2025-10", content: "逻辑推理游戏和思维导图工作坊都很有意思。适合喜欢深度思考的同学。", tags: ["逻辑训练", "深度思考"] },
  ],
  51: [ // 国际文化交流协会
    { name: "白同学", grade: "大三·国际关系", avatar: "🌐", rating: 5, date: "2025-12", content: "和留学生一起过各国节日太有意思了！英语交流能力不知不觉就提升了。", tags: ["文化体验丰富", "英语提升"] },
    { name: "Sarah", grade: "大二·英语", avatar: "🗺️", rating: 5, date: "2025-10", content: "国际美食节是我最喜欢的活动，能吃到各国菜还能交到外国朋友。社团氛围很国际化。", tags: ["国际化", "美食节赞"] },
  ],
  52: [ // 游泳社
    { name: "江同学", grade: "大三·体育教育", avatar: "🏊", rating: 5, date: "2025-11", content: "从旱鸭子到能游1500米自由泳，教练特别有耐心。夏天泡在泳池里太爽了！", tags: ["零基础到精通", "教练耐心"] },
    { name: "李同学", grade: "大二·运动训练", avatar: "🌊", rating: 4, date: "2025-10", content: "校际游泳赛拿了团体第二，训练很规律。就是冬天水有点凉哈哈。", tags: ["比赛成绩好", "训练规律"] },
  ],
  53: [ // 设计师联盟
    { name: "陆同学", grade: "大三·视觉传达", avatar: "🎨", rating: 5, date: "2025-12", content: "UI设计工作坊让我从零学会了Figma，作品集直接用社团项目填满了。找实习时作品集超加分！", tags: ["技能提升", "作品集加分"] },
    { name: "程同学", grade: "大二·工业设计", avatar: "✏️", rating: 5, date: "2025-10", content: "设计马拉松太刺激了，24小时出方案锻炼了我的设计思维。社团有Adobe全家桶正版授权可以用。", tags: ["设计马拉松", "资源好"] },
  ],
};

export default function ClubDetailPage() {
  const params = useParams();
  const [club, setClub] = useState<Club|null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("about");
  const [showMembers, setShowMembers] = useState(false);
  const [revealContact, setRevealContact] = useState<number|null>(null);
  const { addToWishlist, isInWishlist, isFull } = useWishlist();

  useEffect(() => { fetch(`/api/clubs?id=${params.id}`).then(r=>r.json()).then(d=>{setClub(d);setLoading(false);}).catch(()=>setLoading(false)); }, [params.id]);

  if (loading) return <div className="text-center py-20 text-[#888]">加载中...</div>;
  if (!club) return <div className="text-center py-20 text-[#888]">社团不存在</div>;
  const tags = JSON.parse(club.tags||"[]") as string[];

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FFB5BA]/10 to-transparent" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-[#FFB5BA]/20 via-[#E6C6FF]/20 to-[#A8D8FF]/20 flex items-center justify-center">
        <span className="text-7xl">{club.logo||"🎯"}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFE] to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-12 relative">
        <Link href="/clubs" className="inline-flex items-center gap-1 text-[#888] text-sm mb-4 hover:text-[#FF8A9C] transition">← 返回</Link>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-4xl border-4 border-white">{club.logo||"🎯"}</div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-[#4A4A4A]">{club.name}</h1>
                <span className="bg-[#B8E6B8] text-[#4A4A4A] text-xs px-3 py-1 rounded-full font-medium">招新中</span>
              </div>
              <div className="flex items-center gap-4 text-[#888] text-sm">
                <span className="bg-[#FFB5BA]/20 text-[#FF8A9C] px-3 py-1 rounded-full">{club.category}</span>
                <span>👥 {club.memberCount} 名成员</span>
                <span>⭐ 4.9 评分</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-1">
              {[{k:"about",l:"社团介绍",c:"#FFB5BA"},{k:"reviews",l:"学长学姐说",c:"#B8E6B8"},{k:"activities",l:"社团活动",c:"#A8D8FF"},{k:"faq",l:"常见问题",c:"#E6C6FF"}].map(t=>(
                <button key={t.k} onClick={()=>setTab(t.k)} className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${tab===t.k?`text-white shadow-lg`:"text-[#666]"}`} style={tab===t.k?{backgroundColor:t.c}:{}}>
                  {t.l}
                </button>
              ))}
            </div>

            {tab==="about" && (
              <div className="macaron-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#4A4A4A] mb-6">关于我们</h3>
                <p className="text-[#666] leading-relaxed text-lg mb-8">{club.description}</p>
                <h4 className="font-bold text-[#4A4A4A] mb-4">社团标签</h4>
                <div className="flex flex-wrap gap-3">{tags.map(t=><span key={t} className="px-4 py-2 bg-[#F5F5F5] text-[#888] rounded-full text-sm hover:bg-[#FFB5BA]/20 hover:text-[#FF8A9C] transition cursor-pointer">#{t}</span>)}</div>
                <h4 className="font-bold text-[#4A4A4A] mb-4 mt-8">适合什么样的人</h4>
                <p className="text-[#666]">对{tags.slice(0,2).join("、")}感兴趣的同学，零基础也欢迎！</p>
              </div>
            )}

            {tab==="reviews" && (
              <div className="space-y-6">
                {/* 评分总览 */}
                <div className="macaron-card rounded-2xl p-8">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-[#4A4A4A]">4.9</div>
                      <div className="flex gap-1 mt-2 justify-center">
                        {[1,2,3,4,5].map(i => <span key={i} className={`text-lg ${i<=4?"text-[#FFE4B5]":"text-[#FFE4B5]/50"}`}>★</span>)}
                      </div>
                      <div className="text-sm text-[#888] mt-1">{(reviewsData[club.id]||[]).length} 条评价</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[{l:"5星",w:"85%",c:"#FFB5BA"},{l:"4星",w:"12%",c:"#A8D8FF"},{l:"3星",w:"3%",c:"#B8E6B8"},{l:"2星",w:"0%",c:"#FFE4B5"},{l:"1星",w:"0%",c:"#E6C6FF"}].map(r=>(
                        <div key={r.l} className="flex items-center gap-3 text-sm">
                          <span className="text-[#888] w-8">{r.l}</span>
                          <div className="flex-1 h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{width:r.w, backgroundColor:r.c}} />
                          </div>
                          <span className="text-[#AAA] w-8 text-right">{r.w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 评价列表 */}
                {(reviewsData[club.id]||[
                  { name: "匿名同学", grade: "大二", avatar: "😊", rating: 5, date: "2025-10", content: "社团体验很好，推荐加入！氛围友好，活动丰富。", tags: ["推荐加入"] },
                  { name: "匿名同学", grade: "大三", avatar: "👍", rating: 4, date: "2025-09", content: "总体不错的社团，能学到东西也能交到朋友。", tags: ["值得加入"] },
                ]).map((review, i) => (
                  <div key={i} className="macaron-card rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB5BA]/30 to-[#E6C6FF]/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-[#4A4A4A]">{review.name}</span>
                            <span className="text-[#888] text-sm ml-2">{review.grade}</span>
                          </div>
                          <span className="text-[#AAA] text-sm">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s<=review.rating?"text-[#FFE4B5]":"text-[#F0F0F0]"}`}>★</span>)}
                        </div>
                        <p className="text-[#666] leading-relaxed mb-3">{review.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {review.tags.map(t => (
                            <span key={t} className="px-3 py-1 bg-[#F5F5F5] text-[#888] rounded-full text-xs">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab==="activities" && (
              <div className="macaron-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#4A4A4A] mb-6">常规活动</h3>
                <div className="space-y-4">
                  {["每周例会与技能分享","月度主题活动","学期汇报展示"].map((a,i)=>(
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/50 rounded-2xl border border-white/60">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#A8D8FF]/30 to-[#E6C6FF]/30 rounded-xl flex items-center justify-center">📅</div>
                      <span className="font-medium text-[#4A4A4A] text-lg">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab==="faq" && (
              <div className="macaron-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#4A4A4A] mb-6">常见问题</h3>
                {[{q:"零基础可以加入吗？",a:"当然可以！我们欢迎所有感兴趣的同学"},{q:"每周需要投入多少时间？",a:"一般每周2-4小时，可以根据个人情况灵活安排"},{q:"如何报名？",a:"点击「立即报名」填写基本信息即可"}].map((f,i)=>(
                  <div key={i} className="mb-6 p-4 bg-white/50 rounded-xl">
                    <div className="font-semibold text-[#4A4A4A] mb-2">Q: {f.q}</div>
                    <div className="text-[#666]">A: {f.a}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="macaron-card rounded-2xl overflow-hidden">
              <div className="h-2 progress-rainbow" />
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-[#4A4A4A]">报名信息</h3>
                {/* 成员数 - 可展开 */}
                <button onClick={()=>setShowMembers(!showMembers)} className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60 hover:bg-[#FFB5BA]/5 transition cursor-pointer text-left">
                  <span className="text-[#888]">核心成员</span>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {(membersData[club.id]||[]).slice(0,3).map((m,i)=>(
                        <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFB5BA]/30 to-[#E6C6FF]/30 flex items-center justify-center text-sm border-2 border-white">{m.avatar}</div>
                      ))}
                    </div>
                    <span className="font-bold text-[#4A4A4A]">{(membersData[club.id]||[]).length}人</span>
                    <span className={`text-[#888] text-sm transition-transform ${showMembers?"rotate-180":""}`}>▼</span>
                  </div>
                </button>

                {/* 成员展开列表 */}
                {showMembers && (
                  <div className="space-y-2 animate-in">
                    {(membersData[club.id]||[]).map((m,i)=>(
                      <div key={i} className="p-3 bg-white/60 rounded-xl border border-white/60">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB5BA]/20 to-[#E6C6FF]/20 flex items-center justify-center text-lg flex-shrink-0">{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#4A4A4A] text-sm">{m.name}</span>
                              <span className="bg-[#E6C6FF]/30 text-[#9B7CB6] text-[10px] px-2 py-0.5 rounded-full font-medium">{m.role}</span>
                            </div>
                            <div className="text-[#AAA] text-xs mt-0.5">{m.grade}</div>
                          </div>
                          <button
                            onClick={(e)=>{e.stopPropagation();setRevealContact(revealContact===i?null:i);}}
                            className="px-3 py-1.5 text-xs rounded-lg border border-[#A8D8FF]/50 text-[#5BA3D0] hover:bg-[#A8D8FF]/10 transition flex-shrink-0"
                          >
                            {revealContact===i?"隐藏":"联系"}
                          </button>
                        </div>
                        {revealContact===i && (
                          <div className="mt-2 ml-13 pl-[52px] text-xs text-[#888] bg-[#A8D8FF]/10 rounded-lg px-3 py-2">
                            📱 {m.contact}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="text-center text-xs text-[#AAA] pt-1">共 {club.memberCount} 名成员 · 以上为核心团队</div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60"><span className="text-[#888]">招新状态</span><span className="bg-[#B8E6B8] text-[#4A4A4A] text-xs px-3 py-1 rounded-full font-medium">进行中</span></div>
                {club.requirements && (
                  <div className="p-4 bg-white/50 rounded-2xl border border-white/60">
                    <h4 className="font-bold text-[#4A4A4A] mb-3">✅ 招新要求</h4>
                    <p className="text-[#666] text-sm">{club.requirements}</p>
                  </div>
                )}
                <Link href={`/apply/${club.id}`} className="block w-full text-center py-4 btn-macaron rounded-xl font-semibold text-lg">立即报名</Link>
              </div>
            </div>

            <div className="macaron-card rounded-2xl p-6 flex gap-3">
              <button onClick={()=>addToWishlist({clubId:club.id,clubName:club.name,logo:club.logo,category:club.category})} disabled={isInWishlist(club.id)||isFull()} className={`flex-1 py-4 rounded-xl font-medium transition ${isInWishlist(club.id)?"bg-[#B8E6B8]/20 text-[#6CB46C] border border-[#B8E6B8]":isFull()?"bg-[#f0f0f0] text-[#bbb] border border-[#e0e0e0] cursor-not-allowed":"border border-[#FFB5BA]/50 text-[#FF8A9C] hover:bg-[#FFB5BA]/10"}`}>
                {isInWishlist(club.id)?"✓ 已在意向单":isFull()?"意向单已满（最多3个）":"📋 加入意向单"}
              </button>
            </div>

            {club.contactInfo && (
              <div className="macaron-card rounded-2xl p-6">
                <h4 className="font-bold text-[#4A4A4A] mb-3">📱 联系方式</h4>
                <p className="text-[#666] text-sm">{club.contactInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
