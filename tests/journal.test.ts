import test from 'node:test';
import assert from 'node:assert/strict';
import {initialData,stats,weekStart,net,type Trade} from '../app/model.ts';
import {schema} from '../lib/validation.ts';
const base:Trade={id:'t',accountId:'a',date:'2026-11-05',symbol:'MGC',direction:'Long',quantity:1,gross:100,fees:5,risk:50,setup:'',session:'New York',emotion:'Calm',plan:true,stop:true,reason:'',lesson:'Wait for confirmation',screenshot:'',createdAt:'2026-11-05T10:00:00Z'};
test('empty journal does not contain reference trades',()=>assert.deepEqual(initialData(),{accounts:[],trades:[],dailyLimit:2,reflections:{}}));
test('fees, losses and drawdown use net results',()=>{const s=stats([base,{...base,id:'2',gross:-40,fees:5,createdAt:'2026-11-05T11:00:00Z'}],[]);assert.equal(net(base),95);assert.equal(s.net,50);assert.equal(s.drawdown,45);assert.equal(s.winRate,50);assert.equal(s.pf,95/45);});
test('weekly boundary crosses calendar year correctly',()=>assert.equal(weekStart('2027-01-03'),'2026-12-28'));
test('validation rejects impossible dates, negative fees and negative revisions',()=>{const data={...initialData(),trades:[base]};assert.equal(schema.safeParse({revision:0,data}).success,true);for(const patch of [{date:'2026-02-30'},{fees:-1},{quantity:0}])assert.equal(schema.safeParse({revision:0,data:{...data,trades:[{...base,...patch}]}}).success,false);assert.equal(schema.safeParse({revision:-1,data}).success,false);});
