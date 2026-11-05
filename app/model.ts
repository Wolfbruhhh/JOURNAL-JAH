export type Account = { id: string; firm: string; name: string; size: number; market: 'CFD' | 'Futures'; stage: string };
export type Trade = { id: string; accountId: string; date: string; symbol: string; direction: 'Long' | 'Short'; quantity: number; gross: number; fees: number; risk: number; setup: string; session: string; emotion: string; plan: boolean; stop: boolean; reason: string; lesson: string; screenshot: string; createdAt: string };
export type JournalData = { accounts: Account[]; trades: Trade[]; dailyLimit: number; reflections: Record<string, string> };
export const net = (t: Trade) => Math.round((t.gross-t.fees)*100)/100;
export const money = (n: number, signed=false) => `${n<0?'−':signed&&n>0?'+':''}$${Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
export const dateLabel = (d: string, year=false) => new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',...(year?{year:'numeric'}:{}) ,timeZone:'UTC'});
export function localToday() { return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); }
export function shiftDate(d:string,n:number) { const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10); }
export function weekStart(d:string) {return shiftDate(d,-((new Date(d+'T12:00:00Z').getUTCDay()+6)%7));}
export function score(t:Trade,accounts:Account[]) { const a=accounts.find(a=>a.id===t.accountId);return (t.plan?30:0)+(t.stop?25:0)+(a&&t.risk>0&&t.risk/a.size<=0.01?20:0)+(['Calm','Confident'].includes(t.emotion)?15:0)+(t.lesson.trim()?10:0); }
export function stats(trades:Trade[],accounts:Account[]) {
 const values=trades.map(net),wins=values.filter(n=>n>0),losses=values.filter(n=>n<0),gp=wins.reduce((a,b)=>a+b,0),gl=-losses.reduce((a,b)=>a+b,0),n=trades.length,rs=trades.filter(t=>t.risk>0);
 let peak=0,balance=0,dd=0;for(const t of [...trades].sort((a,b)=>a.date.localeCompare(b.date)||a.createdAt.localeCompare(b.createdAt))){balance+=net(t);peak=Math.max(peak,balance);dd=Math.max(dd,peak-balance);}
 return {net:gp-gl,wins:wins.length,losses:losses.length,breakeven:n-wins.length-losses.length,count:n,winRate:n?wins.length/n*100:0,pf:gl?gp/gl:gp?Infinity:0,avgR:rs.length?rs.reduce((s,t)=>s+net(t)/t.risk,0)/rs.length:0,score:n?trades.reduce((s,t)=>s+score(t,accounts),0)/n:0,avgWin:wins.length?gp/wins.length:0,avgLoss:losses.length?gl/losses.length:0,drawdown:dd,best:n?Math.max(...values):0,worst:n?Math.min(...values):0};
}
export function initialData():JournalData { return {accounts:[],trades:[],dailyLimit:2,reflections:{}}; }
