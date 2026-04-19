/* ============================================
   电机再智生管理平台 - 前端路由 & 页面渲染
   ============================================ */

(function () {
  'use strict';

  // ───── DOM refs ─────
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const pageTitle = document.getElementById('pageTitle');
  const toggleBtn = document.getElementById('toggleSidebar');
  const navItems = document.querySelectorAll('.nav-item[data-page]');

  // ───── Sidebar toggle ─────
  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('show');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // ───── Router ─────
  const titles = {
    home: '工作台', emc: 'EMC再造', replace: '置换再造', lease: '租赁再造',
    repair: '维修服务', energy: '节能服务', recycle: '回收 / 出售', parts: '零件商城',
    orders: '订单管理', settlement: '结算中心',
    enterprise: '企业管理', members: '会员管理', dict: '数据字典', stats: '数据看板'
  };

  function navigate(page) {
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === page));
    pageTitle.textContent = titles[page] || page;
    content.innerHTML = '';
    content.className = 'content page-enter';
    const renderer = pages[page] || pages.home;
    renderer(content);
    if (window.innerWidth <= 768) sidebar.classList.remove('show');
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigate(item.dataset.page);
    });
  });

  // ───── Helper ─────
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') el.className = v;
      else if (k === 'innerHTML') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v);
    });
    children.flat().forEach(c => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  // ───── Mock Data ─────
  const mockOrders = [
    { id: 'EMC-20260401-001', type: 'EMC再造', motor: 'Y2-200L-4 30kW', enterprise: '鑫达电力有限公司', status: 'active', date: '2026-04-01', amount: '¥38,500' },
    { id: 'ZH-20260328-003', type: '置换再造', motor: 'YE3-160M-2 15kW', enterprise: '华泰制造集团', status: 'pending', date: '2026-03-28', amount: '¥12,200' },
    { id: 'ZL-20260325-002', type: '租赁再造', motor: 'YE4-250M-6 37kW', enterprise: '正源工业', status: 'done', date: '2026-03-25', amount: '¥56,800' },
    { id: 'WX-20260320-005', type: '维修服务', motor: 'Y2-132S-4 5.5kW', enterprise: '盛辉机械', status: 'active', date: '2026-03-20', amount: '¥4,600' },
    { id: 'HS-20260315-007', type: '回收', motor: 'Y-280S-4 75kW', enterprise: '宏远重工', status: 'done', date: '2026-03-15', amount: '¥8,900' },
  ];

  const motorTypes = ['Y系列', 'Y2系列', 'YE3系列', 'YE4系列', 'YVF系列', 'YKK系列', 'YBX系列'];
  const bizTypes = ['EMC再造', '置换再造', '租赁再造', '维修', '节能', '回收', '出售'];
  const powerOpts = ['0.75kW', '1.1kW', '2.2kW', '5.5kW', '7.5kW', '11kW', '15kW', '22kW', '30kW', '37kW', '45kW', '55kW', '75kW', '90kW', '110kW', '132kW', '160kW', '200kW'];

  // ═══════════════════════════════════════════════
  //  PAGE RENDERERS
  // ═══════════════════════════════════════════════

  const pages = {};

  // ────── 首页 / 工作台 ──────
  pages.home = (root) => {
    // Stat cards
    const stats = [
      { icon: 'ri-recycle-line', cls: 'green', val: '128', label: '再造项目', trend: '+12 本月', up: true },
      { icon: 'ri-building-2-line', cls: 'blue', val: '56', label: '合作企业', trend: '+3 本月', up: true },
      { icon: 'ri-file-list-3-line', cls: 'orange', val: '342', label: '进行中订单', trend: '+28 本周', up: true },
      { icon: 'ri-money-cny-circle-line', cls: 'purple', val: '¥2.86M', label: '本月结算', trend: '+18.5%', up: true },
    ];
    const statGrid = h('div', { className: 'grid grid-4' },
      stats.map(s => h('div', { className: 'card stat-card' },
        h('div', { className: `stat-icon ${s.cls}` }, h('i', { className: s.icon })),
        h('div', { className: 'stat-info' },
          h('h3', null, s.val),
          h('p', null, s.label),
          h('div', { className: `stat-trend ${s.up ? 'up' : 'down'}` }, `${s.up ? '↑' : '↓'} ${s.trend}`)
        )
      ))
    );
    root.appendChild(statGrid);

    // Quick actions
    const actions = [
      { icon: 'ri-flashlight-line', label: 'EMC再造', page: 'emc' },
      { icon: 'ri-swap-box-line', label: '置换再造', page: 'replace' },
      { icon: 'ri-hand-coin-line', label: '租赁再造', page: 'lease' },
      { icon: 'ri-tools-line', label: '维修服务', page: 'repair' },
      { icon: 'ri-leaf-line', label: '节能服务', page: 'energy' },
      { icon: 'ri-loop-left-line', label: '回收 / 出售', page: 'recycle' },
      { icon: 'ri-settings-4-line', label: '零件商城', page: 'parts' },
      { icon: 'ri-bar-chart-box-line', label: '数据看板', page: 'stats' },
    ];
    const quickCard = h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '快捷入口')),
      h('div', { className: 'quick-grid' },
        actions.map(a => {
          const btn = h('div', { className: 'quick-btn' },
            h('i', { className: a.icon }),
            h('span', null, a.label)
          );
          btn.addEventListener('click', () => navigate(a.page));
          return btn;
        })
      )
    );
    root.appendChild(quickCard);

    // Recent orders
    const orderCard = h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' },
        h('div', { className: 'card-title' }, '最近订单'),
        (() => { const b = h('button', { className: 'btn btn-outline btn-sm' }, '查看全部'); b.addEventListener('click', () => navigate('orders')); return b; })()
      ),
      h('div', { className: 'table-wrap' }, buildOrderTable(mockOrders.slice(0, 5)))
    );
    root.appendChild(orderCard);

    // Two col bottom
    const bottomGrid = h('div', { className: 'grid grid-2', style: 'margin-top:20px' },
      // Timeline
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '平台动态')),
        h('div', { className: 'timeline' },
          [
            { time: '2026-04-07 10:23', text: '鑫达电力 提交了EMC再造申请' },
            { time: '2026-04-06 16:45', text: '华泰制造 置换再造方案已确认' },
            { time: '2026-04-05 09:12', text: '正源工业 租赁再造电机已交付' },
            { time: '2026-04-04 14:33', text: '盛辉机械 维修服务订单已完成' },
            { time: '2026-04-03 11:00', text: '宏远重工 电机回收结算已入账' },
          ].map(t => h('div', { className: 'timeline-item' },
            h('div', { className: 'tl-time' }, t.time),
            h('div', { className: 'tl-text' }, t.text)
          ))
        )
      ),
      // Chart
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '月度再造趋势')),
        buildBarChart([
          { label: '1月', val: 18 }, { label: '2月', val: 22 }, { label: '3月', val: 30 },
          { label: '4月', val: 26 }, { label: '5月', val: 34 }, { label: '6月', val: 40 },
          { label: '7月', val: 38 }, { label: '8月', val: 45 }, { label: '9月', val: 42 },
          { label: '10月', val: 50 }, { label: '11月', val: 55 }, { label: '12月', val: 60 },
        ])
      )
    );
    root.appendChild(bottomGrid);
  };

  // ────── EMC再造 ──────
  pages.emc = (root) => renderRemanufPage(root, {
    title: 'EMC再造服务',
    desc: '基于EMC（合同能源管理）模式，平台对企业电机进行再制造，通过节能收益分成实现共赢。',
    color: 'green',
    steps: ['提交申请', '系统初评', '平台复评', '再造方案', '签订合同', '再造跟踪', '电机交付', '收益结算'],
    features: [
      { icon: 'ri-file-text-line', title: '申请表', desc: '填写电机参数、联系方式等信息提交再造申请' },
      { icon: 'ri-line-chart-line', title: '电机测评', desc: '系统自动对电机进行初测评并生成报告' },
      { icon: 'ri-vidicon-line', title: '线上/现场验机', desc: '支持视频通话远程验机或现场勘察' },
      { icon: 'ri-draft-line', title: '再造方案', desc: '平台上传EMC再造方案，双方确认后进入下阶段' },
      { icon: 'ri-quill-pen-line', title: '电子合同', desc: '在线签署EMC再造合同，通过API对接合同系统' },
      { icon: 'ri-truck-line', title: '电机交付', desc: '支持物流配送及自提两种交付方式' },
      { icon: 'ri-money-cny-box-line', title: '收益结算', desc: '按月抄表，自动扣款分成，生成收益结算单' },
      { icon: 'ri-bar-chart-grouped-line', title: '节能数据', desc: '记录月度抄表数据，分析节能效果' },
    ],
    formFields: emcFormFields(),
  });

  // ────── 置换再造 ──────
  pages.replace = (root) => renderRemanufPage(root, {
    title: '置换再造服务',
    desc: '企业提交旧电机，平台进行再制造并提供置换电机，双方结算置换差价。',
    color: 'blue',
    steps: ['提交申请', '选择电机', '系统初评', '平台复评', '再造方案', '签订合同', '再造跟踪', '电机交付', '差价结算'],
    features: [
      { icon: 'ri-swap-line', title: '选择置换电机', desc: '浏览平台可置换电机库，支持搜索与分类筛选' },
      { icon: 'ri-file-chart-line', title: '差价初评', desc: '系统依据测评规则自动生成置换差价单' },
      { icon: 'ri-vidicon-line', title: '验机复评', desc: '线上视频或现场勘察，修正差价' },
      { icon: 'ri-exchange-funds-line', title: '差价结算', desc: '签合同后自动扣除差价或返还余款' },
    ],
    formFields: emcFormFields(),
  });

  // ────── 租赁再造 ──────
  pages.lease = (root) => renderRemanufPage(root, {
    title: '租赁再造服务',
    desc: '企业以租赁方式获取再造电机，平台评估电机收益率，通过租赁收益实现回报。',
    color: 'orange',
    steps: ['提交申请', '系统初评', '平台复评', '再造方案', '签订合同', '再造跟踪', '电机交付', '租金结算'],
    features: [
      { icon: 'ri-hand-coin-line', title: '租赁评估', desc: '结合租赁率与售卖率评估电机收益率' },
      { icon: 'ri-file-chart-line', title: '初测评报告', desc: '系统生成租赁再造电机测评报告' },
      { icon: 'ri-money-cny-box-line', title: '租金结算', desc: '按月自动扣款，催缴提醒通知' },
    ],
    formFields: emcFormFields(),
  });

  // Generic remanufacture page renderer
  function renderRemanufPage(root, cfg) {
    const colorMap = { green: 'var(--primary)', blue: 'var(--accent)', orange: '#f97316' };
    const mainColor = colorMap[cfg.color] || 'var(--primary)';
    // Hero
    const hero = h('div', { className: 'card', style: `border-left:4px solid ${mainColor}` },
      h('div', { className: 'section-title' }, h('i', { className: 'ri-recycle-line', style: `color:${mainColor}` }), cfg.title),
      h('p', { style: 'color:var(--text-secondary);font-size:.88rem;max-width:700px' }, cfg.desc),
      h('div', { style: 'margin-top:16px;display:flex;gap:10px' },
        (() => { const b = h('button', { className: 'btn btn-primary' }, h('i', { className: 'ri-add-line' }), '发起申请'); b.addEventListener('click', () => openApplyModal(cfg.title)); return b; })(),
        h('button', { className: 'btn btn-outline' }, h('i', { className: 'ri-history-line' }), '我的申请')
      )
    );
    root.appendChild(hero);

    // Flow
    const flowCard = h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '业务流程')),
      h('div', { className: 'flow-steps' },
        cfg.steps.map((s, i) => {
          const cls = i < 2 ? 'done' : i === 2 ? 'current' : '';
          return h('div', { className: `flow-step ${cls}` },
            h('div', { className: 'flow-dot' }, String(i + 1)),
            h('div', { className: 'flow-label' }, s)
          );
        })
      )
    );
    root.appendChild(flowCard);

    // Features grid
    if (cfg.features && cfg.features.length) {
      const fGrid = h('div', { className: 'grid grid-4', style: 'margin-top:20px' },
        cfg.features.map(f => h('div', { className: 'card', style: 'text-align:center' },
          h('i', { className: f.icon, style: `font-size:2rem;color:${mainColor};margin-bottom:10px;display:block` }),
          h('div', { style: 'font-weight:600;margin-bottom:6px' }, f.title),
          h('p', { style: 'font-size:.78rem;color:var(--text-secondary)' }, f.desc)
        ))
      );
      root.appendChild(fGrid);
    }

    // Sample orders for this type
    const relatedOrders = mockOrders.filter(o => o.type.includes(cfg.title.replace('服务', '').replace('再造', '').slice(0, 2)));
    if (relatedOrders.length) {
      root.appendChild(h('div', { className: 'card', style: 'margin-top:20px' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '相关订单')),
        h('div', { className: 'table-wrap' }, buildOrderTable(relatedOrders))
      ));
    }
  }

  // ────── 维修服务 ──────
  pages.repair = (root) => {
    root.appendChild(h('div', { className: 'card', style: 'border-left:4px solid #f97316' },
      h('div', { className: 'section-title' }, h('i', { className: 'ri-tools-line', style: 'color:#f97316' }), '维修服务'),
      h('p', { style: 'color:var(--text-secondary);font-size:.88rem;max-width:700px' },
        '提供电机维修需求提交、费用计算、维修进度跟踪等一站式服务。支持在线预约维修，平台安排工程师上门或电机返厂维修。'),
      h('div', { style: 'margin-top:16px;display:flex;gap:10px' },
        (() => { const b = h('button', { className: 'btn btn-primary' }, h('i', { className: 'ri-add-line' }), '提交维修需求'); b.addEventListener('click', () => openApplyModal('维修服务')); return b; })(),
        h('button', { className: 'btn btn-outline' }, h('i', { className: 'ri-file-list-3-line' }), '维修记录')
      )
    ));

    const items = [
      { icon: 'ri-file-text-line', title: '维修需求', desc: '填写设备参数与故障描述' },
      { icon: 'ri-calculator-line', title: '费用估算', desc: '系统自动估算维修费用' },
      { icon: 'ri-map-pin-line', title: '上门/返厂', desc: '选择维修方式，平台安排调度' },
      { icon: 'ri-timer-line', title: '进度跟踪', desc: '实时查看维修进度与工单状态' },
    ];
    root.appendChild(h('div', { className: 'grid grid-4', style: 'margin-top:20px' },
      items.map(f => h('div', { className: 'card', style: 'text-align:center' },
        h('i', { className: f.icon, style: 'font-size:2rem;color:#f97316;margin-bottom:10px;display:block' }),
        h('div', { style: 'font-weight:600;margin-bottom:6px' }, f.title),
        h('p', { style: 'font-size:.78rem;color:var(--text-secondary)' }, f.desc)
      ))
    ));

    root.appendChild(h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '维修服务必填项与选填项')),
      h('div', { className: 'info-grid' },
        ['电机类型', '电机功率', '故障描述', '联系方式', '期望维修日期', '维修方式'].map(t =>
          h('div', { className: 'info-item' }, h('div', { className: 'label' }, t), h('div', { className: 'value' }, '待填写'))
        )
      )
    ));
  };

  // ────── 节能服务 ──────
  pages.energy = (root) => {
    root.appendChild(h('div', { className: 'card', style: 'border-left:4px solid var(--primary)' },
      h('div', { className: 'section-title' }, h('i', { className: 'ri-leaf-line' }), '节能服务'),
      h('p', { style: 'color:var(--text-secondary);font-size:.88rem;max-width:700px' },
        '提供电机能效评估、节能改造方案及节能数据监测服务。通过再制造提升电机能效等级，降低企业能耗成本。'),
      h('div', { style: 'margin-top:16px' },
        (() => { const b = h('button', { className: 'btn btn-primary' }, h('i', { className: 'ri-add-line' }), '节能需求提交'); b.addEventListener('click', () => openApplyModal('节能服务')); return b; })()
      )
    ));
    root.appendChild(h('div', { className: 'grid grid-3', style: 'margin-top:20px' },
      [
        { icon: 'ri-bar-chart-line', title: '能效评估', desc: '对现有电机进行能效等级评定' },
        { icon: 'ri-lightbulb-line', title: '节能方案', desc: '定制化节能改造方案' },
        { icon: 'ri-line-chart-line', title: '数据监测', desc: '接入监测系统，实时查看能耗数据' },
      ].map(f => h('div', { className: 'card', style: 'text-align:center' },
        h('i', { className: f.icon, style: 'font-size:2rem;color:var(--primary);margin-bottom:10px;display:block' }),
        h('div', { style: 'font-weight:600;margin-bottom:6px' }, f.title),
        h('p', { style: 'font-size:.78rem;color:var(--text-secondary)' }, f.desc)
      ))
    ));
  };

  // ────── 回收 / 出售 ──────
  pages.recycle = (root) => {
    const tabs = h('div', { className: 'tabs' },
      h('div', { className: 'tab active', 'data-tab': 'recycle' }, '电机回收'),
      h('div', { className: 'tab', 'data-tab': 'sell' }, '电机出售'),
      h('div', { className: 'tab', 'data-tab': 'buy' }, '买再生电机')
    );
    const tabContent = h('div');
    root.appendChild(tabs);
    root.appendChild(tabContent);

    function renderTab(name) {
      tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
      tabContent.innerHTML = '';
      if (name === 'recycle') {
        tabContent.appendChild(h('div', { className: 'card' },
          h('div', { className: 'section-title' }, h('i', { className: 'ri-loop-left-line' }), '提交回收需求'),
          h('p', { style: 'color:var(--text-secondary);font-size:.85rem;margin-bottom:16px' }, '填写待回收电机信息，平台评估后给出回收报价。'),
          buildMiniForm(['电机型号', '电机功率', '使用年限', '当前状态', '联系人', '联系电话'])
        ));
      } else if (name === 'sell') {
        tabContent.appendChild(h('div', { className: 'card' },
          h('div', { className: 'section-title' }, h('i', { className: 'ri-store-line' }), '发布出售信息'),
          h('p', { style: 'color:var(--text-secondary);font-size:.85rem;margin-bottom:16px' }, '发布企业闲置电机出售信息，平台撮合交易。'),
          buildMiniForm(['电机型号', '电机功率', '期望价格', '数量', '联系人', '联系电话'])
        ));
      } else {
        tabContent.appendChild(h('div', { className: 'card' },
          h('div', { className: 'section-title' }, h('i', { className: 'ri-shopping-cart-line' }), '再生电机商城'),
          h('div', { className: 'grid grid-3', style: 'margin-top:12px' },
            [
              { name: 'YE3-160M-2 再生电机', power: '15kW', price: '¥6,800', status: '在售' },
              { name: 'Y2-200L-4 再生电机', power: '30kW', price: '¥11,200', status: '在售' },
              { name: 'YE4-250M-6 再生电机', power: '37kW', price: '¥18,500', status: '预订中' },
              { name: 'Y2-132S-4 再生电机', power: '5.5kW', price: '¥3,200', status: '在售' },
              { name: 'YKK-355M-4 再生电机', power: '220kW', price: '¥42,000', status: '已售罄' },
              { name: 'YBX3-180M-4 再生电机', power: '18.5kW', price: '¥8,900', status: '在售' },
            ].map(m => h('div', { className: 'card', style: 'cursor:pointer' },
              h('div', { style: 'font-weight:600;margin-bottom:6px' }, m.name),
              h('div', { className: 'info-grid' },
                h('div', { className: 'info-item' }, h('div', { className: 'label' }, '功率'), h('div', { className: 'value' }, m.power)),
                h('div', { className: 'info-item' }, h('div', { className: 'label' }, '价格'), h('div', { className: 'value', style: 'color:var(--primary)' }, m.price)),
              ),
              h('div', { style: 'margin-top:10px' },
                h('span', { className: `badge-status ${m.status === '在售' ? 'active' : m.status === '预订中' ? 'pending' : 'done'}` }, m.status)
              )
            ))
          )
        ));
      }
    }
    tabs.addEventListener('click', e => { if (e.target.dataset.tab) renderTab(e.target.dataset.tab); });
    renderTab('recycle');
  };

  // ────── 零件商城 ──────
  pages.parts = (root) => {
    root.appendChild(h('div', { className: 'card' },
      h('div', { className: 'section-title' }, h('i', { className: 'ri-settings-4-line' }), '电机零件商城'),
      h('p', { style: 'color:var(--text-secondary);font-size:.85rem;margin-bottom:16px' },
        '浏览和购买电机配件，也可发布出售闲置零配件。选择产品后加入购物车，提交订单后平台线下安排发货。'),
    ));

    const parts = [
      { name: '轴承 6310-2RS', cat: '轴承', price: '¥85', stock: 236 },
      { name: '碳刷 CB-204', cat: '碳刷', price: '¥32', stock: 512 },
      { name: '定子线圈 YE3-160M', cat: '线圈', price: '¥1,280', stock: 48 },
      { name: '转子总成 Y2-200L', cat: '转子', price: '¥3,560', stock: 15 },
      { name: '风叶 Y2-132', cat: '风叶', price: '¥45', stock: 320 },
      { name: '端盖 YE3-250M', cat: '端盖', price: '¥680', stock: 64 },
      { name: '密封圈套装', cat: '密封件', price: '¥28', stock: 800 },
      { name: '接线盒 Y系列通用', cat: '接线盒', price: '¥56', stock: 190 },
    ];
    root.appendChild(h('div', { className: 'grid grid-4', style: 'margin-top:16px' },
      parts.map(p => h('div', { className: 'card', style: 'cursor:pointer' },
        h('div', { style: 'font-weight:600;margin-bottom:4px' }, p.name),
        h('div', { style: 'font-size:.75rem;color:var(--text-secondary);margin-bottom:8px' }, `分类: ${p.cat}`),
        h('div', { style: 'display:flex;justify-content:space-between;align-items:center' },
          h('span', { style: 'font-weight:700;color:var(--primary)' }, p.price),
          h('span', { style: 'font-size:.75rem;color:var(--text-secondary)' }, `库存 ${p.stock}`)
        ),
        h('button', { className: 'btn btn-primary btn-sm', style: 'width:100%;margin-top:10px;justify-content:center' }, h('i', { className: 'ri-shopping-cart-line' }), '加入购物车')
      ))
    ));
  };

  // ────── 订单管理 ──────
  pages.orders = (root) => {
    const tabs = h('div', { className: 'tabs' },
      h('div', { className: 'tab active', 'data-tab': 'all' }, '全部订单'),
      h('div', { className: 'tab', 'data-tab': 'active' }, '进行中'),
      h('div', { className: 'tab', 'data-tab': 'pending' }, '待处理'),
      h('div', { className: 'tab', 'data-tab': 'done' }, '已完成')
    );
    const tableWrap = h('div', { className: 'card' });
    root.appendChild(h('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px' },
      tabs,
      h('button', { className: 'btn btn-outline btn-sm' }, h('i', { className: 'ri-download-line' }), '导出')
    ));
    root.appendChild(tableWrap);

    function renderOrders(filter) {
      tabs.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === filter));
      const list = filter === 'all' ? mockOrders : mockOrders.filter(o => o.status === filter);
      tableWrap.innerHTML = '';
      tableWrap.appendChild(h('div', { className: 'table-wrap' }, buildOrderTable(list)));
    }
    tabs.addEventListener('click', e => { if (e.target.dataset.tab) renderOrders(e.target.dataset.tab); });
    renderOrders('all');
  };

  // ────── 结算中心 ──────
  pages.settlement = (root) => {
    const stats = [
      { icon: 'ri-money-cny-circle-line', cls: 'green', val: '¥2,860,000', label: '本月结算额' },
      { icon: 'ri-exchange-funds-line', cls: 'blue', val: '¥1,230,000', label: '待结算' },
      { icon: 'ri-hand-coin-line', cls: 'orange', val: '¥680,000', label: '平台收益' },
      { icon: 'ri-arrow-up-circle-line', cls: 'purple', val: '¥450,000', label: '企业拨款' },
    ];
    root.appendChild(h('div', { className: 'grid grid-4' },
      stats.map(s => h('div', { className: 'card stat-card' },
        h('div', { className: `stat-icon ${s.cls}` }, h('i', { className: s.icon })),
        h('div', { className: 'stat-info' }, h('h3', null, s.val), h('p', null, s.label))
      ))
    ));

    const settlements = [
      { id: 'ST-001', order: 'EMC-20260401-001', type: 'EMC收益', amount: '¥12,500', status: '已结算', date: '2026-04-05' },
      { id: 'ST-002', order: 'ZH-20260328-003', type: '置换差价', amount: '¥3,200', status: '待结算', date: '2026-04-06' },
      { id: 'ST-003', order: 'ZL-20260325-002', type: '租赁租金', amount: '¥8,600', status: '已结算', date: '2026-04-03' },
    ];
    root.appendChild(h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '结算记录')),
      h('div', { className: 'table-wrap' },
        (() => {
          const t = document.createElement('table');
          t.innerHTML = `<thead><tr><th>结算单号</th><th>关联订单</th><th>类型</th><th>金额</th><th>状态</th><th>日期</th></tr></thead>
          <tbody>${settlements.map(s => `<tr><td>${s.id}</td><td>${s.order}</td><td>${s.type}</td><td style="font-weight:600">${s.amount}</td><td><span class="badge-status ${s.status === '已结算' ? 'done' : 'pending'}">${s.status}</span></td><td>${s.date}</td></tr>`).join('')}</tbody>`;
          return t;
        })()
      )
    ));
  };

  // ────── 企业管理 ──────
  pages.enterprise = (root) => {
    root.appendChild(h('div', { className: 'card' },
      h('div', { className: 'card-header' },
        h('div', { className: 'card-title' }, '企业会员列表'),
        h('button', { className: 'btn btn-primary btn-sm' }, h('i', { className: 'ri-add-line' }), '新增企业')
      ),
      h('div', { className: 'table-wrap' },
        (() => {
          const t = document.createElement('table');
          t.innerHTML = `<thead><tr><th>企业名称</th><th>联系人</th><th>电话</th><th>行业</th><th>会员等级</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr><td>鑫达电力有限公司</td><td>张经理</td><td>138****2210</td><td>电力</td><td><span class="badge-status active">金牌</span></td><td><span class="badge-status active">已认证</span></td><td><button class="btn btn-outline btn-sm">详情</button></td></tr>
            <tr><td>华泰制造集团</td><td>李总</td><td>139****8866</td><td>制造</td><td><span class="badge-status pending">银牌</span></td><td><span class="badge-status active">已认证</span></td><td><button class="btn btn-outline btn-sm">详情</button></td></tr>
            <tr><td>正源工业</td><td>王主任</td><td>136****5512</td><td>化工</td><td><span class="badge-status done">普通</span></td><td><span class="badge-status pending">审核中</span></td><td><button class="btn btn-outline btn-sm">审核</button></td></tr>
            <tr><td>盛辉机械</td><td>陈工</td><td>151****3398</td><td>机械</td><td><span class="badge-status done">普通</span></td><td><span class="badge-status active">已认证</span></td><td><button class="btn btn-outline btn-sm">详情</button></td></tr>
            <tr><td>宏远重工</td><td>赵总</td><td>186****7745</td><td>重工</td><td><span class="badge-status active">金牌</span></td><td><span class="badge-status active">已认证</span></td><td><button class="btn btn-outline btn-sm">详情</button></td></tr>
          </tbody>`;
          return t;
        })()
      )
    ));
  };

  // ────── 会员管理 ──────
  pages.members = (root) => {
    root.appendChild(h('div', { className: 'grid grid-3' },
      [
        { level: '金牌会员', count: 12, color: '#f59e0b', benefits: '优先派单、费用折扣95折、专属客服' },
        { level: '银牌会员', count: 28, color: '#6b7280', benefits: '费用折扣98折、节日福利' },
        { level: '普通会员', count: 64, color: '#d97706', benefits: '基础服务、平台资讯' },
      ].map(m => h('div', { className: 'card', style: `border-top:3px solid ${m.color}` },
        h('div', { style: 'font-weight:700;font-size:1.1rem;margin-bottom:4px' }, m.level),
        h('h3', { style: 'font-size:2rem;margin:8px 0' }, String(m.count)),
        h('p', { style: 'font-size:.78rem;color:var(--text-secondary)' }, m.benefits)
      ))
    ));
    root.appendChild(h('div', { className: 'card', style: 'margin-top:20px' },
      h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '会员权益配置')),
      h('p', { style: 'color:var(--text-secondary);font-size:.85rem' }, '管理会员等级划分、权益设置、积分规则等。可配置会员升降级条件及专属服务。')
    ));
  };

  // ────── 数据字典 ──────
  pages.dict = (root) => {
    const dicts = [
      { name: '业务类型', items: bizTypes },
      { name: '电机类型', items: motorTypes },
      { name: '电机功率', items: powerOpts },
      { name: '供电方式', items: ['交流', '直流', '变频'] },
      { name: '再造类型', items: ['EMC再造', '置换再造', '租赁再造'] },
      { name: '交付方式', items: ['物流配送', '平台自提', '企业自提'] },
      { name: '结算方式', items: ['自动扣款', '手动支付', '银行转账'] },
      { name: '订单状态', items: ['待处理', '进行中', '已完成', '已取消'] },
    ];
    root.appendChild(h('div', { className: 'card' },
      h('div', { className: 'card-header' },
        h('div', { className: 'card-title' }, '数据字典管理'),
        h('button', { className: 'btn btn-primary btn-sm' }, h('i', { className: 'ri-add-line' }), '新增字典')
      ),
      h('p', { style: 'color:var(--text-secondary);font-size:.82rem;margin-bottom:16px' }, '管理系统中所有下拉选项、枚举值等基础数据。填写项目中可做选项的项目，做成数据字典基础数据。'),
      ...dicts.map(d => h('div', { style: 'margin-bottom:16px' },
        h('div', { style: 'font-weight:600;font-size:.88rem;margin-bottom:6px' }, d.name),
        h('div', { className: 'dict-tags' },
          d.items.map(i => h('span', { className: 'dict-tag' }, i))
        )
      ))
    ));
  };

  // ────── 数据看板 ──────
  pages.stats = (root) => {
    const stats = [
      { icon: 'ri-recycle-line', cls: 'green', val: '1,286', label: '累计再造电机' },
      { icon: 'ri-leaf-line', cls: 'blue', val: '8,450 MWh', label: '累计节能量' },
      { icon: 'ri-building-2-line', cls: 'orange', val: '156', label: '服务企业数' },
      { icon: 'ri-money-cny-circle-line', cls: 'purple', val: '¥28.6M', label: '累计交易额' },
    ];
    root.appendChild(h('div', { className: 'grid grid-4' },
      stats.map(s => h('div', { className: 'card stat-card' },
        h('div', { className: `stat-icon ${s.cls}` }, h('i', { className: s.icon })),
        h('div', { className: 'stat-info' }, h('h3', null, s.val), h('p', null, s.label))
      ))
    ));

    root.appendChild(h('div', { className: 'grid grid-2', style: 'margin-top:20px' },
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '月度再造数量')),
        buildBarChart([
          { label: '1月', val: 42 }, { label: '2月', val: 38 }, { label: '3月', val: 55 },
          { label: '4月', val: 48 }, { label: '5月', val: 62 }, { label: '6月', val: 70 },
          { label: '7月', val: 65 }, { label: '8月', val: 78 }, { label: '9月', val: 72 },
          { label: '10月', val: 85 }, { label: '11月', val: 92 }, { label: '12月', val: 100 },
        ])
      ),
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '业务类型分布')),
        buildDonutLegend([
          { label: 'EMC再造', val: 38, color: 'var(--primary)' },
          { label: '置换再造', val: 28, color: 'var(--accent)' },
          { label: '租赁再造', val: 18, color: '#f97316' },
          { label: '维修服务', val: 10, color: '#a855f7' },
          { label: '其他', val: 6, color: '#6b7280' },
        ])
      )
    ));

    root.appendChild(h('div', { className: 'grid grid-2', style: 'margin-top:20px' },
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '节能效果统计')),
        buildBarChart([
          { label: '1月', val: 520 }, { label: '2月', val: 480 }, { label: '3月', val: 680 },
          { label: '4月', val: 610 }, { label: '5月', val: 750 }, { label: '6月', val: 830 },
        ], '#3b82f6')
      ),
      h('div', { className: 'card' },
        h('div', { className: 'card-header' }, h('div', { className: 'card-title' }, '收益结算趋势')),
        buildBarChart([
          { label: '1月', val: 180 }, { label: '2月', val: 220 }, { label: '3月', val: 310 },
          { label: '4月', val: 280 }, { label: '5月', val: 360 }, { label: '6月', val: 420 },
        ], '#a855f7')
      )
    ));
  };

  // ═══════════════════════════════════════════════
  //  SHARED COMPONENTS
  // ═══════════════════════════════════════════════

  function buildOrderTable(orders) {
    const t = document.createElement('table');
    t.innerHTML = `<thead><tr><th>订单号</th><th>类型</th><th>电机型号</th><th>企业</th><th>金额</th><th>状态</th><th>日期</th></tr></thead>
    <tbody>${orders.map(o => `<tr><td style="font-weight:600">${o.id}</td><td>${o.type}</td><td>${o.motor}</td><td>${o.enterprise}</td><td>${o.amount}</td><td><span class="badge-status ${o.status}">${{ active: '进行中', pending: '待处理', done: '已完成', error: '异常' }[o.status]}</span></td><td>${o.date}</td></tr>`).join('')}</tbody>`;
    return t;
  }

  function buildBarChart(data, color) {
    const max = Math.max(...data.map(d => d.val));
    const barColor = color || 'var(--primary)';
    const wrap = h('div', { style: 'display:flex;align-items:flex-end;gap:6px;height:160px;padding-top:10px' },
      data.map(d => {
        const pct = (d.val / max) * 100;
        const bar = h('div', { style: 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end' },
          h('div', { style: `font-size:.65rem;color:var(--text-secondary)` }, String(d.val)),
          h('div', { style: `width:100%;max-width:32px;height:${pct}%;background:${barColor};border-radius:4px 4px 0 0;min-height:4px;transition:height .6s ease;opacity:.85` }),
          h('div', { style: 'font-size:.6rem;color:var(--text-secondary);white-space:nowrap' }, d.label)
        );
        return bar;
      })
    );
    return wrap;
  }

  function buildDonutLegend(data) {
    const total = data.reduce((s, d) => s + d.val, 0);
    const wrap = h('div', { style: 'display:flex;align-items:center;gap:30px;padding:20px 0' },
      h('div', { style: 'width:120px;height:120px;border-radius:50%;background:conic-gradient(' +
        (() => {
          let acc = 0;
          return data.map(d => {
            const start = acc;
            acc += (d.val / total) * 360;
            return `${d.color} ${start}deg ${acc}deg`;
          }).join(',');
        })() +
        ');flex-shrink:0;position:relative' },
        h('div', { style: 'position:absolute;inset:25px;border-radius:50%;background:var(--surface)' })
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:8px' },
        data.map(d => h('div', { style: 'display:flex;align-items:center;gap:8px;font-size:.82rem' },
          h('div', { style: `width:10px;height:10px;border-radius:2px;background:${d.color}` }),
          h('span', null, `${d.label} ${d.val}%`)
        ))
      )
    );
    return wrap;
  }

  function buildMiniForm(fields) {
    const form = h('div');
    const row = h('div', { className: 'form-row' });
    fields.forEach(f => {
      row.appendChild(h('div', { className: 'form-group' },
        h('label', null, f),
        h('input', { type: 'text', placeholder: `请输入${f}` })
      ));
    });
    form.appendChild(row);
    form.appendChild(h('div', { style: 'margin-top:12px' },
      h('button', { className: 'btn btn-primary' }, h('i', { className: 'ri-send-plane-line' }), '提交')
    ));
    return form;
  }

  function emcFormFields() {
    return ['企业名称', '联系人', '联系电话', '电机型号', '电机功率', '电机数量', '供电方式', '使用年限'];
  }

  // ───── Modal ─────
  function openApplyModal(title) {
    let overlay = document.querySelector('.modal-overlay');
    if (!overlay) {
      overlay = h('div', { className: 'modal-overlay' });
      document.body.appendChild(overlay);
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    }
    const fields = emcFormFields();
    overlay.innerHTML = '';
    const modal = h('div', { className: 'modal' },
      h('div', { className: 'modal-title' },
        h('span', null, `${title} - 发起申请`),
        (() => { const b = h('button', null, h('i', { className: 'ri-close-line' })); b.addEventListener('click', () => overlay.classList.remove('open')); return b; })()
      ),
      h('div', { className: 'form-row' },
        fields.map(f => h('div', { className: 'form-group' },
          h('label', null, f),
          f === '电机型号'
            ? (() => {
                const sel = document.createElement('select');
                sel.innerHTML = '<option value="">请选择电机型号</option>' + motorTypes.map(t => `<option>${t}</option>`).join('');
                return sel;
              })()
            : f === '电机功率'
              ? (() => {
                  const sel = document.createElement('select');
                  sel.innerHTML = '<option value="">请选择功率</option>' + powerOpts.map(t => `<option>${t}</option>`).join('');
                  return sel;
                })()
              : f === '供电方式'
                ? (() => {
                    const sel = document.createElement('select');
                    sel.innerHTML = '<option value="">请选择</option><option>交流</option><option>直流</option><option>变频</option>';
                    return sel;
                  })()
                : h('input', { type: 'text', placeholder: `请输入${f}` })
        ))
      ),
      h('div', { className: 'form-group' },
        h('label', null, '备注说明'),
        h('textarea', { rows: '3', placeholder: '请输入补充说明（选填）' })
      ),
      h('div', { style: 'display:flex;gap:10px;justify-content:flex-end;margin-top:8px' },
        (() => { const b = h('button', { className: 'btn btn-outline' }, '取消'); b.addEventListener('click', () => overlay.classList.remove('open')); return b; })(),
        (() => {
          const b = h('button', { className: 'btn btn-primary' }, h('i', { className: 'ri-check-line' }), '提交申请');
          b.addEventListener('click', () => {
            overlay.classList.remove('open');
            showToast('申请已提交，平台将尽快处理！');
          });
          return b;
        })()
      )
    );
    overlay.appendChild(modal);
    requestAnimationFrame(() => overlay.classList.add('open'));
  }

  // ───── Toast ─────
  function showToast(msg) {
    const toast = h('div', {
      style: 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:12px 28px;border-radius:var(--radius);font-weight:600;font-size:.88rem;z-index:9999;box-shadow:var(--shadow-md);animation:fadeIn .3s ease'
    }, msg);
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 2500);
  }

  // ───── Init ─────
  navigate('home');

})();
