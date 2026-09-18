const stepButtons = document.querySelectorAll('[data-step]');
const currentStep = document.querySelector('.panel-header .eyebrow');
const title = document.querySelector('#panel-title');
const form = document.querySelector('#setup-form');
const completion = document.querySelector('.completion');
const previousButton = document.querySelector('#previous-step');
const nextButton = document.querySelector('#next-step');
const dashboardButton = document.querySelector('#dashboard-button');
const lineButton = document.querySelector('#line-button');
const capabilityButton = document.querySelector('#capability-button');
const evidenceButton = document.querySelector('#evidence-button');
const setupNavigation = document.querySelector('#setup-navigation');
const workspace = document.querySelector('.workspace');
const summary = document.querySelector('.project-summary');
const contentPanel = document.querySelector('.content-panel');

const steps = {
  1: '投资方案',
  2: '里程碑',
  3: '阶段预算',
  4: '阶段组织',
  5: '岗位契约',
  6: 'KPI 与数据源',
  7: '基线确认',
};

const descriptions = {
  1: '定义项目基本信息、投资目标和治理角色，为后续里程碑与基线配置建立起点。',
  2: '按 M0 至 M6 建立阶段成果、计划周期、预算和关键 Gate。',
  3: '配置阶段预算、资金用途和拨付前置条件。',
  4: '根据阶段任务确认关键岗位、到岗时间和组织准备度。',
  5: '明确项目岗位职责、权限边界和 RACI 协作关系。',
  6: '建立里程碑指标、数据来源、可信度与预警规则。',
  7: '核对四类基线，完成审批确认并锁定版本。',
};

const templates = {
  1: `
    <div class="form-grid">
      <label>项目名称<input name="projectName" value="骊珠一号 MAH 项目" /></label>
      <label>MAH 项目类型<select name="mahType"><option>化学药品</option><option>生物制品</option><option>中药</option></select></label>
      <label>投资总额（元）<input name="investment" value="100,000,000" /></label>
      <label>项目周期（月）<input name="duration" value="36" /></label>
      <label>被投主体<input name="entity" placeholder="请输入被投企业名称" /></label>
      <label>投资人代表<input name="investor" placeholder="请输入投资人代表" /></label>
      <label>企业项目负责人<input name="projectOwner" placeholder="待指定" /></label>
      <label>PMO<input name="pmo" placeholder="待指定" /></label>
    </div>
    <label class="wide-field">投资目标<textarea>在受控预算和合规质量前提下，推动项目从投资交割、开发验证和注册准备走向获批及商业化准备。</textarea></label>`,
  2: `
    <div class="notice"><strong>价值权重：</strong>用于计算项目总进度；各里程碑权重合计必须为 100%，硬 Gate 不受加权进度影响。</div>
    <div class="table-wrap"><table><thead><tr><th>里程碑</th><th>示例成果</th><th>预算上限</th><th>价值权重</th><th>Gate 状态</th></tr></thead><tbody>
      <tr><td>M0 项目启动</td><td>交易条件、治理和基线生效</td><td>¥500 万</td><td><input class="weight-input" value="5" aria-label="M0 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
      <tr><td>M1 技术方案确认</td><td>技术、注册和供应策略明确</td><td>¥1,000 万</td><td><input class="weight-input" value="10" aria-label="M1 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
      <tr><td>M2 小试与方法建立</td><td>小试结果与质量标准形成</td><td>¥1,500 万</td><td><input class="weight-input" value="15" aria-label="M2 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
      <tr class="highlight"><td>M3 中试与工艺验证准备</td><td>中试批次、设备及工艺验证</td><td>¥2,500 万</td><td><input class="weight-input" value="25" aria-label="M3 价值权重" />%</td><td><span class="tag focus">重点演示</span></td></tr>
      <tr><td>M4 注册申报与审评支持</td><td>申报资料提交及审评应答</td><td>¥2,000 万</td><td><input class="weight-input" value="20" aria-label="M4 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
      <tr><td>M5 获批与商业化准备</td><td>许可、供应和上市准备</td><td>¥1,500 万</td><td><input class="weight-input" value="15" aria-label="M5 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
      <tr><td>M6 市场与商业化验证、投资复盘</td><td>经营证据和投资假设复盘</td><td>¥1,000 万</td><td><input class="weight-input" value="10" aria-label="M6 价值权重" />%</td><td><span class="tag pending">待配置</span></td></tr>
    </tbody></table></div><p class="weight-total">权重合计：<strong id="weight-total">100%</strong><span id="weight-message">可用于基线确认</span></p><div class="schedule-config"><p class="section-label">里程碑基线时间（演示）</p><div><span>M0</span><strong>2026/01/01—01/31</strong><em>已完成</em></div><div><span>M1</span><strong>2026/02/01—03/31</strong><em>已完成</em></div><div><span>M2</span><strong>2026/04/01—05/31</strong><em>进行中</em></div><div class="schedule-risk"><span>M3</span><strong>2026/06/01—06/30</strong><em>预测完成：07/26</em></div><div><span>M4</span><strong>2026/07/01—09/30</strong><em>待启动</em></div><div><span>M5</span><strong>2026/10/01—12/31</strong><em>待启动</em></div><div><span>M6</span><strong>2027/01/01—03/31</strong><em>待启动</em></div></div>`,
  3: `
    <div class="notice"><strong>资金配置原则：</strong>阶段拨付须同时满足时间窗口和 Gate 条件；例外拨付必须保留风险与审批记录。</div>
    <div class="allocation-list">
      <div><span>M0–M2 前期验证</span><strong>¥3,000 万</strong><small>技术、方法、质量与稳定性证据</small></div>
      <div><span>M3 中试验证</span><strong>¥2,500 万</strong><small>设备、工艺、质量与数据完整性</small></div>
      <div><span>M4 注册申报</span><strong>¥2,000 万</strong><small>申报资料与审评应答</small></div>
      <div><span>M5–M6 上市与验证</span><strong>¥2,500 万</strong><small>获批、供应、商业化和复盘</small></div>
    </div>`,
  4: `
    <div class="form-grid"><label>当前配置阶段<select><option>M0 项目启动</option><option>M3 中试与工艺验证准备</option></select></label><label>组织准备度目标<input value="100%" /></label></div>
    <div class="role-list"><span>企业项目负责人</span><span>PMO</span><span>研发负责人</span><span>工艺负责人</span><span>质量负责人 QA</span><span>注册负责人</span><span>设备与工程负责人</span><span>供应链与采购负责人</span><span>财务负责人</span><span>HR 负责人</span></div>`,
  5: `
    <div class="table-wrap"><table><thead><tr><th>角色</th><th>主要职责</th><th>权限重点</th><th>RACI</th></tr></thead><tbody>
    <tr><td>项目负责人</td><td>项目最终交付</td><td>重大变更确认</td><td>A</td></tr>
    <tr><td>PMO</td><td>计划、数据、风险与 PDCA</td><td>计划与版本治理</td><td>R</td></tr>
    <tr><td>质量负责人 QA</td><td>质量与合规</td><td>质量 Gate 审核</td><td>C</td></tr>
    <tr><td>投资人代表</td><td>投资目标与重大 Gate</td><td>拨付与重大风险决策</td><td>I</td></tr>
    </tbody></table></div>`,
  6: `
    <div class="form-grid"><label>数据接入方式<select><option>模拟数据</option><option>Excel / CSV 导入</option><option>系统 API</option></select></label><label>预警规则<input value="关键路径延期、硬 Gate 阻塞、资金偏差" /></label></div>
    <div class="source-grid"><div><strong>A 级</strong><span>受控生产、财务、质量记录</span></div><div><strong>B 级</strong><span>正式文档或受控导出</span></div><div><strong>C 级</strong><span>经确认的人工填报</span></div><div><strong>D/E 级</strong><span>仅作预警与待核实分析</span></div></div>`,
  7: `
    <div class="baseline-grid"><div><p>Project Baseline</p><strong>项目基线</strong><span>目标、里程碑、Gate、KPI 与关键路径</span></div><div><p>Financial Baseline</p><strong>财务基线</strong><span>总投资、预算、拨付条件与用途</span></div><div><p>Organization Baseline</p><strong>组织基线</strong><span>岗位、职责、权限与能力要求</span></div><div><p>Performance Baseline</p><strong>绩效基线</strong><span>KPI、OKR、口径与审批关系</span></div></div>
    <div class="notice"><strong>确认前检查：</strong>当前为前端演示配置。项目审批人确认后，系统将锁定四类基线并生成版本 V1.0。</div>`,
};

let activeStep = 1;
let dashboardOpen = false;

const dashboardTemplate = `
  <section class="dashboard-header"><div><p class="eyebrow">运行驾驶舱 / 项目总览</p><h2>项目正在偏离 M3 计划</h2><p>当前延误来自设备 OQ 延期，并已穿透至资金拨付与下一阶段 Gate 风险。</p></div><button class="secondary-button" id="back-to-setup" type="button">返回初始化</button></section>
  <section class="metric-grid"><article><p>项目计划进度</p><strong>44%</strong><span>按里程碑价值权重计算</span></article><article class="metric-risk"><p>项目实际进度</p><strong>39%</strong><span>较计划落后 5 个百分点</span></article><article><p>预算执行</p><strong>¥4,180 万</strong><span>占总投资 41.8%</span></article><article class="metric-risk"><p>组织准备度</p><strong>67%</strong><span>关键岗位缺 1 人</span></article></section>
  <section class="progress-board"><div class="section-head"><div><p class="section-label">加权进度对比</p><h3>项目与里程碑计划 / 实际进度</h3></div><span class="weight-note">价值权重合计 100%</span></div><div class="progress-row total-progress"><strong>项目总进度</strong><div><span>计划 44%</span><i><b style="width:44%"></b></i></div><div><span>实际 39%</span><i class="actual"><b style="width:39%"></b></i></div><em>-5pp</em></div><div class="milestone-board"><button data-milestone="M0"><strong>M0</strong><small>权重 5%</small><span>计划 100% / 实际 100%</span></button><button data-milestone="M1"><strong>M1</strong><small>权重 10%</small><span>计划 100% / 实际 100%</span></button><button data-milestone="M2"><strong>M2</strong><small>权重 15%</small><span>计划 80% / 实际 75%</span></button><button class="current" data-milestone="M3"><strong>M3</strong><small>权重 25%</small><span>计划 68% / 实际 52%</span></button><button data-milestone="M4"><strong>M4</strong><small>权重 20%</small><span>未启动</span></button><button data-milestone="M5"><strong>M5</strong><small>权重 15%</small><span>未启动</span></button><button data-milestone="M6"><strong> M6</strong><small>权重 10%</small><span>未启动</span></button></div><section class="milestone-focus" id="milestone-focus"></section></section>
  <section class="narrative-card"><div class="narrative-title"><span class="alert-dot"></span><div><p class="section-label">高影响事项 #01</p><h3>设备 OQ 延期 26 天，已阻塞工艺验证与申报准备</h3></div><span class="tag risk">高风险</span></div><ol class="impact-chain"><li><strong>事实</strong><span>设备 OQ 预计延至 7 月 26 日，位于关键路径。</span></li><li><strong>直接原因</strong><span>供应商工程师尚未到场，设备调试无法完成。</span></li><li><strong>上游制约</strong><span>设备尾款未支付，供应商未安排工程师。</span></li><li><strong>根因</strong><span>第二阶段投资款延迟，拨付条件仍待确认。</span></li><li><strong>项目影响</strong><span>M3 Gate 预计推迟 26 天；需投资人代表决策。</span></li></ol><button class="text-button" id="open-m3-detail" type="button">进入 M3 穿透分析 →</button></section>
  <section class="dashboard-columns"><div class="dashboard-card"><div class="card-heading"><div><p class="section-label">关键路径与 Gate</p><h3>M3 中试与工艺验证准备</h3></div><span class="tag risk">Gate 阻塞</span></div><div class="path-row"><span class="done">中试批次</span><i></i><span class="risk-node">设备 OQ</span><i></i><span>工艺验证</span><i></i><span>申报准备</span></div><div class="gate-detail"><span>关键 Gate：设备 OQ、质量与数据完整性</span><strong>预测完成：7 月 26 日</strong></div></div><div class="dashboard-card"><div class="card-heading"><div><p class="section-label">资金与进度匹配</p><h3>阶段拨付</h3></div><span class="tag warning">待处理</span></div><div class="funding-row"><span>第二阶段投资款</span><strong>¥1,500 万</strong><em>延迟 12 天</em></div><div class="funding-row"><span>设备尾款</span><strong>¥280 万</strong><em>未支付</em></div><p class="card-note">资金未到位已成为关键路径阻塞因素，需降低设备负责人的可控责任权重。</p></div></section>
  <section class="dashboard-card pdca-card"><div class="card-heading"><div><p class="section-label">PDCA 整改闭环</p><h3>设备 OQ 与资金拨付协同整改</h3></div><span class="tag focus">执行中</span></div><div class="pdca-grid"><div><b>P</b><span>核验拨付条件与资金缺口</span></div><div><b>D</b><span>推动尾款支付并锁定工程师档期</span></div><div><b>C</b><span>7 月 18 日复核 OQ 排期与 Gate 影响</span></div><div><b>A</b><span>必要时提交投资人例外拨付决策</span></div></div><div class="owners"><span>Owner：财务负责人</span><span>协同：设备负责人、PMO、供应链</span><span>升级人：项目负责人 / 投资人代表</span></div></section>`;

const milestoneDetails = {
  M0: { name: '投资交割与项目启动', weight: '5%', plan: 100, actual: 100, gate: '已通过', lines: '财务与资金、组织、PMO 治理', note: '交易条件、项目账户、治理机制和核心团队已完成确认。' },
  M1: { name: '项目立项与技术方案确认', weight: '10%', plan: 100, actual: 100, gate: '已通过', lines: '研发、注册、质量、供应链与采购', note: '技术可行性、法规路径和开发计划已形成当前批准版本。' },
  M2: { name: '小试与关键方法建立', weight: '15%', plan: 80, actual: 75, gate: '进行中', lines: '研发、质量、工艺与生产', note: '小试结果和分析方法已形成，稳定性证据仍在补充。' },
  M3: { name: '中试与工艺验证准备', weight: '25%', plan: 68, actual: 52, gate: '阻塞中', lines: '设备与工程、工艺与生产、质量、供应链与采购、注册、研发、市场与商业化', note: '设备 OQ 延期 26 天，阻塞工艺验证和申报准备。' },
  M4: { name: '注册申报与审评支持', weight: '20%', plan: 0, actual: 0, gate: '未启动', lines: '注册、质量、研发、供应链与采购', note: '依赖 M3 工艺验证与数据完整性 Gate 通过。' },
  M5: { name: '获批与商业化准备', weight: '15%', plan: 0, actual: 0, gate: '未启动', lines: '注册、质量、供应链与采购、市场与商业化', note: '聚焦许可、生产供应、渠道与上市准备。' },
  M6: { name: '市场与商业化验证、投资复盘', weight: '10%', plan: 0, actual: 0, gate: '未启动', lines: '市场与商业化、财务与资金、供应链与采购、质量', note: '聚焦销售、回款、毛利、供应和合规证据，以及投资假设复盘。' },
};

function renderMilestoneFocus(id) {
  const item = milestoneDetails[id];
  const focus = document.querySelector('#milestone-focus');
  document.querySelectorAll('[data-milestone]').forEach((button) => button.classList.toggle('current', button.dataset.milestone === id));
  focus.innerHTML = `<div><p class="section-label">${id} / 单里程碑视图</p><h3>${item.name}</h3><p>${item.note}</p></div><div class="milestone-bars"><span>计划 ${item.plan}%<i><b style="width:${item.plan}%"></b></i></span><span>实际 ${item.actual}%<i class="actual"><b style="width:${item.actual}%"></b></i></span></div><div class="milestone-meta"><span>价值权重 <strong>${item.weight}</strong></span><span>Gate <strong class="${item.gate === '阻塞中' ? 'danger-text' : ''}">${item.gate}</strong></span><span>主要条线：${item.lines}</span></div>${id === 'M3' ? '<button class="text-button" id="open-m3-focus" type="button">查看 M3 完整穿透分析 →</button>' : ''}`;
  document.querySelector('#open-m3-focus')?.addEventListener('click', renderM3Detail);
}

const capabilityProfiles = {
  equipment: { role: '设备与工程负责人', line: '设备与工程', result: '设备 OQ 按期完成率 0%，关键设备可用率 75%', fit: '78%', risk: '中等', factors: '阶段拨付延迟、设备尾款未支付、供应商工程师未到场', dimensions: [['设备验证与工程技术', '25%', '4.5', 'OQ 方案、FAT 与验收记录'], ['计划与交付控制', '20%', '3.0', '关键路径任务、OQ 排期记录'], ['质量与合规', '20%', '4.0', '设备验证偏差与质量记录'], ['供应商协同', '15%', '3.5', '供应商排期、到场确认'], ['风险预警与升级', '20%', '4.0', 'PMO 周报、风险升级记录']] },
  pmo: { role: 'PMO', line: '项目管理', result: 'M3 偏差识别及时率 92%，PDCA 按期关闭率 80%', fit: '86%', risk: '低', factors: '上游资金拨付决策等待，跨部门信息更新存在时滞', dimensions: [['计划与关键路径管理', '25%', '4.5', '基线版本、关键路径重算记录'], ['数据治理', '20%', '4.0', '数据来源、可信度与审计记录'], ['风险预警与升级', '25%', '4.5', '风险台账、升级通知'], ['跨部门协同', '15%', '3.5', '会议纪要、问题关闭记录'], ['PDCA 闭环管理', '15%', '4.0', '整改事项与复核记录']] },
  registration: { role: '注册负责人', line: '注册', result: '申报资料准备度 52%，关键资料依赖 M3 验证数据', fit: '82%', risk: '中等', factors: '工艺验证启动受设备 OQ 阻塞，注册资料无法按计划完成', dimensions: [['法规路径与申报策略', '30%', '4.5', '法规路径评估、注册计划'], ['资料统筹与交付', '25%', '3.5', '资料清单、缺口跟踪'], ['质量与合规协同', '20%', '4.0', '质量审阅记录'], ['跨部门协同', '15%', '3.5', '工艺与质量接口记录'], ['风险预警与升级', '10%', '4.0', '资料风险提示、PMO 周报']] },
};

const lineProfiles = {
  equipment: { name: '设备与工程', weight: '30%', plan: 78, actual: 48, schedule: '+26 天', gate: '阻塞 M3 Gate', owner: '设备与工程负责人', okr: '完成关键设备 OQ，满足工艺验证启动条件', kpi: 'OQ 按期完成率 0%，设备可用率 75%', trust: 'A / B 级', action: '完成设备尾款支付，锁定供应商工程师到场时间。' },
  process: { name: '工艺与生产', weight: '25%', plan: 72, actual: 60, schedule: '+12 天', gate: '受上游阻塞', owner: '工艺负责人', okr: '完成工艺验证批次排产与执行准备', kpi: '工艺验证启动准备度 60%', trust: 'B / C 级', action: '依据 OQ 新预测日期重排工艺验证批次。' },
  quality: { name: '质量', weight: '15%', plan: 70, actual: 62, schedule: '+8 天', gate: '待验证数据', owner: '质量负责人 QA', okr: '完成验证文件审阅和数据完整性核查', kpi: '关键质量文件完整率 82%', trust: 'A / B 级', action: '提前审阅 OQ 偏差处理和验证文件模板。' },
  supply: { name: '供应链与采购', weight: '10%', plan: 65, actual: 55, schedule: '+10 天', gate: '影响设备 OQ', owner: '供应链与采购负责人', okr: '保障关键设备服务与物料按期到位', kpi: '关键采购按期到货率 86%', trust: 'A / B 级', action: '核验付款、供应商服务和关键物料的交付承诺。' },
  registration: { name: '注册', weight: '10%', plan: 55, actual: 52, schedule: '+6 天', gate: '等待验证数据', owner: '注册负责人', okr: '完成申报资料准备与资料缺口跟踪', kpi: '申报资料准备度 52%', trust: 'B / C 级', action: '更新资料清单，并标记受验证数据影响的交付项。' },
  research: { name: '研发', weight: '5%', plan: 60, actual: 58, schedule: '+2 天', gate: '无直接阻塞', owner: '研发负责人', okr: '完成工艺验证的技术支持和方法确认', kpi: '方法确认完成率 90%', trust: 'A / B 级', action: '支持工艺验证前方法确认及偏差分析。' },
  commercial: { name: '市场与商业化', weight: '5%', plan: 10, actual: 8, schedule: '按阶段推进', gate: '未进入 Gate', owner: '市场与商业化负责人', okr: '形成上市准备需求与初步市场假设', kpi: '商业化准备资料完成度 8%', trust: 'C 级', action: '维护早期市场假设，等待 M5 启动后提高权重。' },
};

function renderLineModule(selectedKey = 'equipment') {
  document.querySelector('#dashboard-panel')?.remove();
  document.querySelector('#m3-detail')?.remove();
  document.querySelector('#capability-module')?.remove();
  document.querySelector('#line-module')?.remove();
  document.querySelector('#evidence-module')?.remove();
  dashboardOpen = false;
  setupNavigation.hidden = true;
  summary.hidden = true;
  contentPanel.hidden = true;
  workspace.classList.add('dashboard-workspace');
  const module = document.createElement('section');
  module.className = 'line-module';
  module.id = 'line-module';
  module.innerHTML = `<div class="detail-header"><div><p class="eyebrow">M3 中试与工艺验证准备 / 条线与岗位</p><h2>条线—岗位执行总览</h2><p>按条线汇总计划、实际、时间、岗位 OKR、KPI、证据可信度和下一步动作；红色事项优先进入项目风险与 PDCA 闭环。</p></div><button class="secondary-button" id="line-back" type="button">返回驾驶舱</button></div><section class="line-overview"><article><p>条线权重</p><strong>100%</strong><span>七条 M3 运营条线</span></article><article><p>计划加权进度</p><strong>68%</strong><span>基于条线权重计算</span></article><article class="metric-risk"><p>实际加权进度</p><strong>52%</strong><span>设备与工程为主要缺口</span></article><article class="metric-risk"><p>关键路径风险</p><strong>1 项</strong><span>设备 OQ 阻塞 M3 Gate</span></article></section><section class="drill-section"><div class="section-head"><div><p class="section-label">条线执行清单</p><h3>按项目影响度排序</h3></div><span class="weight-note">点击条线查看岗位执行详情</span></div><div class="table-wrap"><table class="line-table"><thead><tr><th>条线</th><th>权重</th><th>计划 / 实际</th><th>时间偏差</th><th>Gate 影响</th><th>关键岗位</th><th>数据可信度</th></tr></thead><tbody>${Object.entries(lineProfiles).map(([key, item]) => `<tr><td><button class="line-select" data-line="${key}">${item.name}</button></td><td>${item.weight}</td><td><span class="line-number">${item.plan}%</span><i class="mini-bar"><b style="width:${item.plan}%"></b></i><span class="line-number actual-number">${item.actual}%</span></td><td class="${item.schedule.startsWith('+') ? 'danger-text' : ''}">${item.schedule}</td><td>${item.gate}</td><td>${item.owner}</td><td>${item.trust}</td></tr>`).join('')}</tbody></table></div></section><section class="line-focus" id="line-focus"></section></section>`;
  workspace.append(module);
  renderLineFocus(selectedKey);
  document.querySelectorAll('[data-line]').forEach((button) => button.addEventListener('click', () => renderLineFocus(button.dataset.line)));
  document.querySelector('#line-back').addEventListener('click', renderDashboard);
  lineButton.textContent = '返回驾驶舱';
}

function renderLineFocus(key) {
  const item = lineProfiles[key];
  document.querySelectorAll('[data-line]').forEach((button) => button.classList.toggle('selected', button.dataset.line === key));
  const focus = document.querySelector('#line-focus');
  focus.innerHTML = `<div><p class="section-label">${item.name} / 岗位执行详情</p><h3>${item.owner}</h3><p>${item.okr}</p></div><div><p class="section-label">关键 KPI</p><strong>${item.kpi}</strong><span>数据可信度：${item.trust}</span></div><div><p class="section-label">下一步动作</p><strong>${item.action}</strong><span>时间偏差：<b class="${item.schedule.startsWith('+') ? 'danger-text' : ''}">${item.schedule}</b></span></div>${key === 'equipment' ? '<button class="text-button" id="line-open-m3" type="button">进入设备与工程的 M3 完整穿透分析 →</button>' : ''}`;
  document.querySelector('#line-open-m3')?.addEventListener('click', renderM3Detail);
}

const evidenceRecords = {
  equipment: { name: '设备 OQ 执行与报告', source: '设备验证计划、设备台账', level: 'B 级', updated: '2026/06/30 18:20', owner: '设备与工程负责人', status: '待补充', note: 'OQ 报告未完成签署；当前预测完成日为 2026/07/26。' },
  payment: { name: '设备尾款付款申请', source: '财务系统、付款申请单', level: 'A 级', updated: '2026/06/29 16:40', owner: '财务负责人', status: '已核验', note: '¥280 万尾款未支付，影响供应商工程师安排。' },
  supplier: { name: '供应商工程师排期确认', source: '受控邮件、供应商服务记录', level: 'C 级', updated: '2026/06/30 10:15', owner: '供应链与采购负责人', status: '待负责人确认', note: '供应商表示在尾款到账后安排工程师进场。' },
  quality: { name: '关键质量文件完整率', source: '质量管理系统、审阅记录', level: 'A 级', updated: '2026/06/30 20:10', owner: '质量负责人 QA', status: '已核验', note: '当前文件完整率 82%，仍有 2 项验证文件待审阅。' },
  registration: { name: '申报资料准备度', source: '注册资料库、PMO 周报', level: 'B 级', updated: '2026/06/30 17:00', owner: '注册负责人', status: '待核查', note: 'M3 验证数据未到位，影响后续资料编制。' },
  commercial: { name: '市场与商业化准备资料', source: '结构化人工填报', level: 'C 级', updated: '2026/06/28 14:30', owner: '市场与商业化负责人', status: '待核查', note: '当前处于早期准备阶段，仅用于预警和假设验证。' },
};

function renderEvidenceModule(selectedKey = 'equipment') {
  document.querySelector('#dashboard-panel')?.remove();
  document.querySelector('#m3-detail')?.remove();
  document.querySelector('#capability-module')?.remove();
  document.querySelector('#line-module')?.remove();
  dashboardOpen = false;
  setupNavigation.hidden = true;
  summary.hidden = true;
  contentPanel.hidden = true;
  workspace.classList.add('dashboard-workspace');
  const module = document.createElement('section');
  module.className = 'evidence-module';
  module.id = 'evidence-module';
  module.innerHTML = `<div class="detail-header"><div><p class="eyebrow">M3 中试与工艺验证准备 / 数据与证据</p><h2>数据可信度与证据台账</h2><p>每个 KPI、OKR 和归因结论均关联数据来源、责任人、更新时间、可信度和核验状态；低可信度信息只用于预警，不用于 Gate 或拨付决策。</p></div><button class="secondary-button" id="evidence-back" type="button">返回驾驶舱</button></div><section class="evidence-summary"><article><p>受控数据 / 正式记录</p><strong>2 项</strong><span>A 级，可用于重大决策</span></article><article><p>可追溯受控材料</p><strong>2 项</strong><span>B 级，责任人已复核或待复核</span></article><article class="metric-risk"><p>人工或非结构化材料</p><strong>2 项</strong><span>C 级，仅用于预警和待核查</span></article><article class="metric-risk"><p>待核查事项</p><strong>4 项</strong><span>影响 M3 预测和归因置信度</span></article></section><section class="drill-section"><div class="section-head"><div><p class="section-label">M3 证据台账</p><h3>按项目影响度与可信度排序</h3></div><span class="weight-note">最后更新：2026/06/30</span></div><div class="table-wrap"><table class="evidence-table"><thead><tr><th>指标 / 事实</th><th>数据来源</th><th>可信度</th><th>更新时间</th><th>责任人</th><th>核验状态</th></tr></thead><tbody>${Object.entries(evidenceRecords).map(([key, item]) => `<tr><td><button class="evidence-select" data-evidence="${key}">${item.name}</button></td><td>${item.source}</td><td><span class="tag ${item.level === 'A 级' ? 'confirmed' : item.level === 'B 级' ? 'focus' : 'warning'}">${item.level}</span></td><td>${item.updated}</td><td>${item.owner}</td><td>${item.status}</td></tr>`).join('')}</tbody></table></div></section><section class="evidence-focus" id="evidence-focus"></section><section class="data-rules"><div><strong>A / B 级</strong><span>可支持 Gate 审核、拨付判断与正式归因；仍须保留来源和责任人。</span></div><div><strong>C 级</strong><span>可用于风险预警和待核实分析，不能独立支持重大决策。</span></div><div><strong>D / E 级</strong><span>来源不完整、过期、冲突或 AI 推断；不得用于 Gate、拨付或绩效结论。</span></div></section>`;
  workspace.append(module);
  renderEvidenceFocus(selectedKey);
  document.querySelectorAll('[data-evidence]').forEach((button) => button.addEventListener('click', () => renderEvidenceFocus(button.dataset.evidence)));
  document.querySelector('#evidence-back').addEventListener('click', renderDashboard);
  evidenceButton.textContent = '返回驾驶舱';
}

function renderEvidenceFocus(key) {
  const item = evidenceRecords[key];
  document.querySelectorAll('[data-evidence]').forEach((button) => button.classList.toggle('selected', button.dataset.evidence === key));
  document.querySelector('#evidence-focus').innerHTML = `<div><p class="section-label">证据详情</p><h3>${item.name}</h3><p>${item.note}</p></div><div><p class="section-label">责任与来源</p><strong>${item.owner}</strong><span>${item.source}</span></div><div><p class="section-label">使用边界</p><strong>${item.level}</strong><span>${item.level === 'A 级' || item.level === 'B 级' ? '可进入人工核验与正式归因流程。' : '需补充正式证据后，才可作为正式结论依据。'}</span></div>`;
}

function renderCapabilityModule(profileKey = 'equipment') {
  document.querySelector('#dashboard-panel')?.remove();
  document.querySelector('#m3-detail')?.remove();
  document.querySelector('#capability-module')?.remove();
  document.querySelector('#line-module')?.remove();
  document.querySelector('#evidence-module')?.remove();
  dashboardOpen = false;
  setupNavigation.hidden = true;
  summary.hidden = true;
  contentPanel.hidden = true;
  workspace.classList.add('dashboard-workspace');
  const profile = capabilityProfiles[profileKey];
  const module = document.createElement('section');
  module.className = 'capability-module';
  module.id = 'capability-module';
  module.innerHTML = `<div class="detail-header"><div><p class="eyebrow">组织准备度 / 岗位能力评价</p><h2>岗位能力适配度</h2><p>结果评价与能力评价分别保留；能力结论须由经核验的行为和证据支撑，不能由单次 KPI 直接推定。</p></div><button class="secondary-button" id="capability-back" type="button">返回驾驶舱</button></div><section class="capability-logic"><div><strong>1. 岗位阶段要求</strong><span>按 M3 任务、Gate 和岗位契约定义能力维度与权重。</span></div><div><strong>2. 证据化能力评分</strong><span>以真实工作行为、交付物和经确认的结果为依据。</span></div><div><strong>3. 归因修正</strong><span>扣除资源、上游依赖、RACI、目标变更和外部约束影响。</span></div><div><strong>4. 形成组织风险</strong><span>评估能力缺口对下一里程碑与关键路径的影响。</span></div></section><section class="capability-toolbar"><label>评价岗位<select id="capability-role"><option value="equipment">设备与工程负责人</option><option value="pmo">PMO</option><option value="registration">注册负责人</option></select></label><span>当前阶段：M3 中试与工艺验证准备</span><span>评价状态：<strong>待直接上级确认</strong></span></section><section id="capability-content"></section>`;
  workspace.append(module);
  renderCapabilityContent(profile);
  document.querySelector('#capability-role').value = profileKey;
  document.querySelector('#capability-role').addEventListener('change', (event) => renderCapabilityContent(capabilityProfiles[event.target.value]));
  document.querySelector('#capability-back').addEventListener('click', renderDashboard);
  capabilityButton.textContent = '返回驾驶舱';
}

function renderCapabilityContent(profile) {
  const content = document.querySelector('#capability-content');
  content.innerHTML = `<section class="capability-summary"><article><p>评价岗位</p><strong>${profile.role}</strong><span>${profile.line}条线 · M3 阶段</span></article><article><p>结果评价（独立）</p><strong>${profile.result}</strong><span>仅描述结果，不直接等同于能力不足。</span></article><article><p>能力适配度</p><strong>${profile.fit}</strong><span>基于加权能力维度与经核验证据。</span></article><article><p>下一阶段风险</p><strong class="${profile.risk === '低' ? '' : 'danger-text'}">${profile.risk}</strong><span>需结合能力缺口与组织准备度判断。</span></article></section><section class="drill-section"><div class="section-head"><div><p class="section-label">能力维度与证据</p><h3>${profile.role} 的 M3 阶段能力要求</h3></div><span class="weight-note">维度权重合计 100%</span></div><div class="table-wrap"><table><thead><tr><th>能力维度</th><th>权重</th><th>适配评分（5分）</th><th>证据</th><th>状态</th></tr></thead><tbody>${profile.dimensions.map(([name, weight, score, evidence]) => `<tr><td>${name}</td><td>${weight}</td><td>${score}</td><td>${evidence}</td><td><span class="tag ${Number(score) >= 4 ? 'confirmed' : 'warning'}">${Number(score) >= 4 ? '匹配' : '待发展'}</span></td></tr>`).join('')}</tbody></table></div></section><section class="capability-correction"><div><p class="section-label">归因修正</p><h3>结果偏差的非岗位可控因素</h3><p>${profile.factors}</p></div><div><p class="section-label">评价结论</p><h3>能力适配度不等于结果达成度</h3><p>当前结论仅用于识别培养、外部专家、协作或资源补足需求；任用、奖惩和淘汰须由授权管理者作出决定。</p></div></section><section class="capability-actions"><div><strong>建议措施</strong><span>补充关键路径交付培训；建立供应商到场升级机制；在 Gate 前增加设备验证预检。</span></div><div><strong>下一次复核</strong><span>2026/07/18，由直接上级、PMO 与相关专业负责人共同核验。</span></div></section>`;
}

function renderStep(step) {
  dashboardOpen = false;
  setupNavigation.hidden = false;
  summary.hidden = false;
  contentPanel.hidden = false;
  workspace.classList.remove('dashboard-workspace');
  document.querySelector('#dashboard-panel')?.remove();
  document.querySelector('#m3-detail')?.remove();
  document.querySelector('#capability-module')?.remove();
  document.querySelector('#line-module')?.remove();
  document.querySelector('#evidence-module')?.remove();
  dashboardButton.textContent = '查看驾驶舱';
  activeStep = Number(step);
  document.querySelector('.step-nav .active').classList.remove('active');
  document.querySelector(`[data-step="${activeStep}"]`).parentElement.classList.add('active');
  currentStep.textContent = `步骤 ${String(activeStep).padStart(2, '0')} / 07`;
  title.textContent = steps[activeStep];
  document.querySelector('.panel-header p:last-child').textContent = descriptions[activeStep];
  form.innerHTML = templates[activeStep];
  completion.textContent = `${Math.round(((activeStep - 1) / 7) * 100)}% 已完成`;
  previousButton.disabled = activeStep === 1;
  nextButton.textContent = activeStep === 7 ? '确认并锁定基线' : '保存并继续';
  if (activeStep === 2) bindWeightInputs();
  enablePointerLight(contentPanel);
}

function enablePointerLight(root) {
  const targets = [...root.querySelectorAll('.metric-grid article, .progress-board, .timeline-board, .narrative-card, .dashboard-card, .content-panel')];
  if (root.matches('.content-panel')) targets.push(root);
  targets.forEach((element) => {
    if (element.dataset.pointerLight) return;
    element.dataset.pointerLight = 'true';
    element.classList.add('pointer-light');
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      element.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
  });
}

function bindWeightInputs() {
  const inputs = [...document.querySelectorAll('.weight-input')];
  const total = document.querySelector('#weight-total');
  const message = document.querySelector('#weight-message');
  const refresh = () => {
    const sum = inputs.reduce((value, input) => value + (Number(input.value) || 0), 0);
    total.textContent = `${sum}%`;
    total.className = sum === 100 ? 'weight-valid' : 'weight-invalid';
    message.textContent = sum === 100 ? '可用于基线确认' : '请调整至 100% 后再确认基线';
  };
  inputs.forEach((input) => input.addEventListener('input', refresh));
  refresh();
}

function renderDashboard() {
  document.querySelector('#m3-detail')?.remove();
  document.querySelector('#capability-module')?.remove();
  document.querySelector('#line-module')?.remove();
  document.querySelector('#evidence-module')?.remove();
  dashboardOpen = true;
  setupNavigation.hidden = true;
  summary.hidden = true;
  contentPanel.hidden = true;
  workspace.classList.add('dashboard-workspace');
  const dashboard = document.createElement('section');
  dashboard.className = 'dashboard-panel';
  dashboard.id = 'dashboard-panel';
  dashboard.innerHTML = dashboardTemplate;
  const timeline = document.createElement('section');
  timeline.className = 'timeline-board';
  timeline.innerHTML = `<div class="section-head"><div><p class="section-label">项目时间线</p><h3>基线计划、当前实际与预测完成时间</h3></div><span class="weight-note">当前日期：2026/06/30</span></div><div class="timeline-scale"><span>2026/01</span><span>03</span><span>05</span><span>07</span><span>09</span><span>11</span><span>2027/01</span><span>03</span></div><div class="timeline-row"><strong>M0</strong><i class="time-segment complete" style="grid-column:1 / 2">01/01—01/31</i><em>完成</em></div><div class="timeline-row"><strong>M1</strong><i class="time-segment complete" style="grid-column:2 / 3">02/01—03/31</i><em>完成</em></div><div class="timeline-row"><strong>M2</strong><i class="time-segment active" style="grid-column:3 / 4">04/01—05/31</i><em>实际 75%</em></div><div class="timeline-row"><strong>M3</strong><i class="time-segment risk-time" style="grid-column:4 / 5">基线 06/01—06/30</i><b class="forecast-segment" style="grid-column:5 / 6">预测至 07/26</b><em class="danger-text">+26 天</em></div><div class="timeline-row"><strong>M4</strong><i class="time-segment future" style="grid-column:5 / 6">07/01—09/30</i><em>等待 M3 Gate</em></div><div class="timeline-row"><strong>M5</strong><i class="time-segment future" style="grid-column:6 / 7">10/01—12/31</i><em>待启动</em></div><div class="timeline-row"><strong>M6</strong><i class="time-segment future" style="grid-column:7 / 8">2027/01—03</i><em>待启动</em></div>`;
  dashboard.querySelector('.narrative-card').before(timeline);
  workspace.append(dashboard);
  enablePointerLight(dashboard);
  dashboardButton.textContent = '初始化配置';
  lineButton.textContent = '条线与岗位';
  capabilityButton.textContent = '岗位能力评价';
  evidenceButton.textContent = '数据与证据';
  renderMilestoneFocus('M3');
  document.querySelectorAll('[data-milestone]').forEach((button) => {
    button.addEventListener('click', () => renderMilestoneFocus(button.dataset.milestone));
  });
  document.querySelector('#back-to-setup').addEventListener('click', () => renderStep(activeStep));
  document.querySelector('#open-m3-detail').addEventListener('click', renderM3Detail);
}

function renderM3Detail() {
  document.querySelector('#dashboard-panel')?.remove();
  document.querySelector('#line-module')?.remove();
  const detail = document.createElement('section');
  detail.className = 'm3-detail';
  detail.id = 'm3-detail';
  detail.innerHTML = `
    <div class="detail-header"><div><p class="eyebrow">项目总览 / M3 中试与工艺验证准备</p><h2>M3 穿透分析</h2><p>从 Gate、KPI 到任务与证据，核查设备 OQ 延期对项目和投资目标的实际影响。</p></div><button class="secondary-button" id="back-to-dashboard" type="button">返回驾驶舱</button></div>
    <section class="m3-progress"><div><p>里程碑计划进度</p><strong>68%</strong></div><div><p>里程碑实际进度</p><strong class="danger-text">52%</strong></div><div><p>预测完成日期</p><strong class="danger-text">7 月 26 日</strong></div><div><p>数据可信度</p><strong>A / B 级</strong></div></section>
    <section class="drill-section"><div class="section-head"><div><p class="section-label">M3 条线加权进度</p><h3>计划与实际对比</h3></div><span class="weight-note">条线权重合计 100%</span></div><div class="line-progress"><div><strong>设备与工程 <small>30%</small></strong><span>计划 78%</span><i><b style="width:78%"></b></i><span class="danger-text">实际 48%</span><i class="actual"><b style="width:48%"></b></i></div><div><strong>工艺与生产 <small>25%</small></strong><span>计划 72%</span><i><b style="width:72%"></b></i><span>实际 60%</span><i class="actual"><b style="width:60%"></b></i></div><div><strong>质量 <small>15%</small></strong><span>计划 70%</span><i><b style="width:70%"></b></i><span>实际 62%</span><i class="actual"><b style="width:62%"></b></i></div><div><strong>供应链与采购 <small>10%</small></strong><span>计划 65%</span><i><b style="width:65%"></b></i><span>实际 55%</span><i class="actual"><b style="width:55%"></b></i></div><div><strong>注册 <small>10%</small></strong><span>计划 55%</span><i><b style="width:55%"></b></i><span>实际 52%</span><i class="actual"><b style="width:52%"></b></i></div><div><strong>研发 <small>5%</small></strong><span>计划 60%</span><i><b style="width:60%"></b></i><span>实际 58%</span><i class="actual"><b style="width:58%"></b></i></div><div><strong>市场与商业化 <small>5%</small></strong><span>计划 10%</span><i><b style="width:10%"></b></i><span>实际 8%</span><i class="actual"><b style="width:8%"></b></i></div></div></section>
    <section class="drill-section"><div class="section-head"><div><p class="section-label">01 / Gate 状态</p><h3>硬 Gate 尚未通过</h3></div><span class="tag risk">阻塞中</span></div><div class="gate-grid"><article class="passed"><strong>中试批次完成</strong><span>证据：批记录与放行记录</span><em>A 级 / 已通过</em></article><article class="blocked"><strong>设备 OQ 完成</strong><span>证据：OQ 执行记录缺失</span><em>B 级 / 延期 26 天</em></article><article><strong>工艺验证可启动</strong><span>前置：设备 OQ 完成</span><em>未满足</em></article><article><strong>数据完整性核查</strong><span>前置：工艺验证完成</span><em>未开始</em></article></div></section>
    <section class="drill-section"><div class="section-head"><div><p class="section-label">02 / KPI 与 KR</p><h3>设备验证 KPI 未达标</h3></div><span class="tag warning">需核查</span></div><div class="table-wrap"><table><thead><tr><th>指标</th><th>目标</th><th>实际</th><th>偏差</th><th>数据来源</th><th>可信度</th></tr></thead><tbody><tr><td>设备 OQ 按期完成率</td><td>100% / 6 月 30 日</td><td>预计 7 月 26 日</td><td class="danger-text">延期 26 天</td><td>设备验证计划、供应商记录</td><td><span class="tag focus">B 级</span></td></tr><tr><td>关键设备可用率</td><td>100%</td><td>75%</td><td class="danger-text">-25%</td><td>设备台账</td><td><span class="tag focus">A 级</span></td></tr><tr><td>工艺验证启动准备度</td><td>100%</td><td>40%</td><td class="danger-text">-60%</td><td>PMO 周报</td><td><span class="tag pending">C 级</span></td></tr></tbody></table></div></section>
    <section class="drill-section"><div class="section-head"><div><p class="section-label">03 / 条线、岗位与 OKR</p><h3>设备与工程条线：从岗位承诺到关键结果</h3></div><span class="weight-note">条线权重 30%</span></div><div class="okr-chain"><article><p>岗位</p><strong>设备与工程负责人</strong><span>R：设备 OQ 执行；A：设备验证交付</span></article><article><p>OKR</p><strong>完成关键设备 OQ，满足工艺验证启动条件</strong><span>适用阶段：M3</span></article><article><p>KR 1</p><strong>6 月 30 日前完成 OQ 报告</strong><span class="danger-text">实际：预计 7 月 26 日</span></article><article><p>KR 2</p><strong>关键设备可用率达到 100%</strong><span class="danger-text">实际：75%</span></article></div><div class="okr-link"><span>岗位 OKR 完成度</span><strong class="danger-text">48%</strong><span>影响设备与工程条线进度，并阻塞 M3 硬 Gate。</span></div></section>
    <section class="drill-section split-detail"><div><div class="section-head"><div><p class="section-label">03 / 任务与依赖</p><h3>关键路径任务</h3></div></div><div class="task-list"><div><span class="task-status done">完成</span><strong>设备 FAT 与到货验收</strong><small>设备负责人 · 6 月 8 日</small></div><div><span class="task-status late">延期</span><strong>设备 OQ 执行与报告</strong><small>设备负责人 · 预计 7 月 26 日</small></div><div><span class="task-status blocked">阻塞</span><strong>工艺验证批次排产</strong><small>工艺负责人 · 等待 OQ</small></div><div><span class="task-status blocked">阻塞</span><strong>申报资料准备</strong><small>注册负责人 · 等待验证数据</small></div></div></div><div><div class="section-head"><div><p class="section-label">04 / 证据与归因核查</p><h3>候选根因</h3></div></div><div class="evidence-list"><div><b>A</b><span><strong>第二阶段投资款拨付记录</strong><small>计划 6 月 18 日，实际待确认</small></span><em>已核验</em></div><div><b>B</b><span><strong>设备尾款付款申请</strong><small>¥280 万，未支付</small></span><em>已核验</em></div><div><b>C</b><span><strong>供应商工程师排期邮件</strong><small>待尾款到账后安排进场</small></span><em>待负责人确认</em></div></div></div></section>
    <section class="drill-section"><div class="section-head"><div><p class="section-label">05 / 归因确认与 PDCA</p><h3 id="attribution-title">归因尚待项目负责人确认</h3></div><span class="tag warning" id="attribution-status">待确认</span></div><div class="attribution"><div><p>直接执行角色</p><strong>设备与工程负责人</strong><span>可控权重：降低，受资金前置条件影响。</span></div><div><p>主要制约因素</p><strong>阶段拨付延迟</strong><span>Owner：财务负责人；需投资人代表核验。</span></div><div><p>下一次复核</p><strong>7 月 18 日</strong><span>验证尾款、工程师到场及新预测日期。</span></div></div><div class="pdca-detail"><span><b>Plan</b> 核验拨付条件并形成例外方案</span><span><b>Do</b> 支付尾款，锁定工程师档期</span><span><b>Check</b> 复核 OQ 与 Gate 影响</span><span><b>Act</b> 触发投资人决策或调整计划版本</span></div><div class="review-actions"><button class="secondary-button" id="raise-objection" type="button">提出异议</button><button class="primary-button" id="confirm-attribution" type="button">确认归因并启动整改</button></div><div class="audit-log" id="audit-log"><p>审计记录</p><span>等待项目负责人确认归因结论。</span></div></section>`;
  const m3Timeline = document.createElement('section');
  m3Timeline.className = 'm3-timeline';
  m3Timeline.innerHTML = `<div class="section-head"><div><p class="section-label">M3 时间线</p><h3>基线、实际与预测完成对比</h3></div><span class="tag risk">关键路径</span></div><div class="m3-time-row"><strong>基线计划</strong><span>2026/06/01</span><i><b style="width:68%"></b></i><span>2026/06/30</span></div><div class="m3-time-row"><strong>当前预测</strong><span>2026/06/03</span><i class="actual"><b style="width:92%"></b></i><span class="danger-text">2026/07/26</span></div><div class="m3-time-row"><strong>受阻条线</strong><span>设备与工程</span><i class="blocked-time"><b style="width:92%"></b></i><span class="danger-text">OQ 延期 26 天</span></div><div class="m3-dependency">设备 OQ 延期 → 工艺验证批次排产受阻 → 注册资料准备延后。时间偏差沿关键路径向后传导。</div>`;
  detail.querySelector('.drill-section').before(m3Timeline);
  workspace.append(detail);
  document.querySelector('#back-to-dashboard').addEventListener('click', renderDashboard);
  document.querySelector('#confirm-attribution').addEventListener('click', () => {
    document.querySelector('#attribution-title').textContent = '归因已确认，PDCA 整改已启动';
    const status = document.querySelector('#attribution-status');
    status.textContent = '已确认';
    status.className = 'tag confirmed';
    document.querySelector('#confirm-attribution').disabled = true;
    document.querySelector('#raise-objection').disabled = true;
    document.querySelector('#audit-log').innerHTML = '<p>审计记录</p><span>项目负责人已确认“阶段拨付延迟”为主要制约因素，并于当前模拟时间启动 PDCA 整改。</span>';
  });
  document.querySelector('#raise-objection').addEventListener('click', () => {
    document.querySelector('#attribution-title').textContent = '已提出异议，等待 PMO 补充核查';
    const status = document.querySelector('#attribution-status');
    status.textContent = '待复核';
    status.className = 'tag objection';
    document.querySelector('#audit-log').innerHTML = '<p>审计记录</p><span>相关责任人已提出异议；系统要求 PMO 补充证据，并在下一次复核前更新归因版本。</span>';
  });
}

stepButtons.forEach((button) => {
  button.addEventListener('click', () => {
    renderStep(button.dataset.step);
  });
});

previousButton.addEventListener('click', () => renderStep(Math.max(1, activeStep - 1)));
nextButton.addEventListener('click', () => {
  if (activeStep < 7) renderStep(activeStep + 1);
  else {
    completion.textContent = '100% 已完成';
    document.querySelector('.status-pill').textContent = '待基线确认';
  }
});

dashboardButton.addEventListener('click', () => {
  if (dashboardOpen) renderStep(activeStep);
  else renderDashboard();
});

capabilityButton.addEventListener('click', () => {
  if (document.querySelector('#capability-module')) renderDashboard();
  else renderCapabilityModule();
});

lineButton.addEventListener('click', () => {
  if (document.querySelector('#line-module')) renderDashboard();
  else renderLineModule();
});

evidenceButton.addEventListener('click', () => {
  if (document.querySelector('#evidence-module')) renderDashboard();
  else renderEvidenceModule();
});

renderStep(activeStep);
