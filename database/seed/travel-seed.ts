import { DataSource } from "typeorm";
import { ScenicSpotEntity } from "../../server/src/modules/travel/entity/scenic-spot.entity";
import { TicketTypeEntity } from "../../server/src/modules/travel/entity/ticket-type.entity";
import { TourRouteEntity } from "../../server/src/modules/travel/entity/tour-route.entity";
import { RouteScheduleEntity } from "../../server/src/modules/travel/entity/route-schedule.entity";
import { TransportGuideEntity } from "../../server/src/modules/travel/entity/transport-guide.entity";

export async function seedTravelData(dataSource: DataSource) {
  const scenicRepo = dataSource.getRepository(ScenicSpotEntity);
  const ticketRepo = dataSource.getRepository(TicketTypeEntity);
  const routeRepo = dataSource.getRepository(TourRouteEntity);
  const scheduleRepo = dataSource.getRepository(RouteScheduleEntity);
  const guideRepo = dataSource.getRepository(TransportGuideEntity);

  // 景区
  const spots = [
    { name: "乌东苗寨景区", address: "贵州省黔东南州雷山县乌东村", open_time: "08:00-18:00", intro: "乌东村是贵州黔东南苗族侗族自治州特色苗寨，拥有苗族银饰锻造、蜡染刺绣、苗家长桌宴、特色民宿、苗寨梯田与节庆文化等文旅资源。", status: 1 },
    { name: "苗族文化博物馆", address: "乌东村文化广场旁", open_time: "09:00-17:00", intro: "馆内陈列苗族银饰、服饰、农耕器具等珍贵文物，展示苗族千年文化传承。", status: 1 },
    { name: "梯田观光区", address: "乌东村后山", open_time: "全天开放", intro: "层层叠叠的梯田是摄影爱好者的天堂。四季皆景，各有特色。", status: 1 },
  ];
  await scenicRepo.save(spots);

  // 票种
  const tickets = [
    { scenic_spot_id: 1, name: "成人票", price: 80, stock: 1000, valid_days: 3 },
    { scenic_spot_id: 1, name: "儿童票", price: 40, stock: 500, valid_days: 3 },
    { scenic_spot_id: 1, name: "家庭套票（2大1小）", price: 160, stock: 200, valid_days: 3 },
    { scenic_spot_id: 1, name: "学生票", price: 50, stock: 300, valid_days: 3 },
    { scenic_spot_id: 2, name: "成人票", price: 30, stock: 500, valid_days: 1 },
    { scenic_spot_id: 2, name: "儿童票", price: 15, stock: 300, valid_days: 1 },
    { scenic_spot_id: 3, name: "全价票", price: 20, stock: 9999, valid_days: 1 },
  ];
  await ticketRepo.save(tickets);

  // 路线套餐
  const routes = [
    { title: "乌东苗寨一日游", duration: "one_day", price: 298, includes: "景区门票·导游讲解·午餐（长桌宴）·银饰体验·蜡染体验", schedule: "上午：参观博物馆→银饰坊\n下午：长桌宴→蜡染体验→梯田观光→返程", start_city: "凯里", dest_city: "乌东村", status: 1, merchant_id: 1, notice: "请提前1天预订，集合地点：凯里高铁站" },
    { title: "苗寨深度两日游", duration: "two_day", price: 598, includes: "所有门票·三正餐一早餐·一晚民宿·导游·体验项目", schedule: "Day1：抵达→博物馆→银饰体验→长桌宴→篝火晚会\nDay2：梯田日出→蜡染体验→苗寨徒步→返程", start_city: "凯里", dest_city: "乌东村", status: 1, merchant_id: 1, notice: "含一晚住宿，单人补房差150元" },
    { title: "非遗研学之旅", duration: "one_day", price: 458, includes: "文化讲堂·银饰锻造体验·蜡染刺绣教学·午餐·材料费", schedule: "上午：文化讲堂→银饰观摩\n下午：蜡染刺绣教学→作品展示", start_city: "乌东村", dest_city: "乌东村", status: 1, merchant_id: 1, notice: "适合亲子/学生团体，8岁以上可参与" },
    { title: "亲子苗寨体验", duration: "two_day", price: 536, includes: "门票·三餐·民宿·亲子手工·农耕体验·保险", schedule: "Day1：亲子手工→银饰DIY→长桌宴→篝火晚会\nDay2：农田体验→糍粑制作→返程", start_city: "贵阳", dest_city: "乌东村", status: 1, merchant_id: 1, notice: "儿童价268元/人（不占床），建议4岁以上" },
  ];
  await routeRepo.save(routes);

  // 路线行程
  const schedules = [
    { route_id: 1, day_number: 1, description: "上午抵达乌东村，参观苗族文化博物馆，前往银饰坊观摩银饰锻造。", attractions: "博物馆、银饰坊", meals: "午餐：苗家长桌宴", transport: "凯里高铁站接站" },
    { route_id: 2, day_number: 1, description: "抵达后参观博物馆和银饰坊，享用长桌宴，入住特色民宿，参加篝火晚会。", attractions: "博物馆、银饰坊、篝火晚会", meals: "晚餐：长桌宴", accommodation: "苗寨特色民宿", transport: "接站" },
    { route_id: 2, day_number: 2, description: "清晨梯田观日出，体验蜡染制作，苗寨徒步后返程。", attractions: "梯田、蜡染工坊", meals: "早餐+午餐", transport: "送站" },
    { route_id: 3, day_number: 1, description: "传承人讲授苗族文化，观摩银饰锻造，亲手制作蜡染作品。", attractions: "文化讲堂、蜡染教室", meals: "午餐：苗家菜" },
    { route_id: 4, day_number: 1, description: "亲子互动游戏+银饰手镯DIY+长桌宴+篝火晚会。", attractions: "亲子活动区", meals: "晚餐：长桌宴", accommodation: "民宿" },
    { route_id: 4, day_number: 2, description: "农田劳作体验+糍粑制作，午餐后返程。", attractions: "农田、糍粑工坊", meals: "早餐+午餐" },
  ];
  await scheduleRepo.save(schedules);

  // 交通攻略
  const guides = [
    { title: "贵阳→乌东苗寨", departure: "贵阳", destination: "乌东", transport_mode: "大巴", duration: 3.5, cost: 120, detail: "贵阳龙洞堡客运站→雷山县城（每日8班），转乡村中巴至乌东村。约3.5小时，费用约120元。", status: 1 },
    { title: "凯里→乌东苗寨", departure: "凯里", destination: "乌东", transport_mode: "中巴", duration: 1.5, cost: 40, detail: "凯里高铁站→雷山班车→乌东村中巴。推荐包车前往（约150元）。", status: 1 },
    { title: "广州→乌东苗寨", departure: "广州", destination: "乌东", transport_mode: "高铁+中巴", duration: 6, cost: 350, detail: "广州南站→凯里南站（高铁约4.5h，230元）→乌东村包车（200元）。", status: 1 },
    { title: "自驾攻略", departure: "贵阳", destination: "乌东", transport_mode: "自驾", duration: 3, cost: 150, detail: "贵阳出发→沪昆高速→凯里西出口→S308省道→雷山→X886县道→乌东村。约3小时，村口有停车场。", status: 1 },
  ];
  await guideRepo.save(guides);

  console.log("线路订票模块种子数据已插入");
}
