export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  completed: boolean;
  studentCount: number;
}

export interface Bus {
  id: string;
  routeNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  capacity: number;
  currentStudents: number;
  status: 'On Route' | 'Delayed' | 'Completed' | 'Not Started';
  speed: number;
  journeyProgress: number;
  totalDistanceKm: number;
  distanceLeftKm: number;
  etaMinutes: number;
  geoFenceStatus: 'Active' | 'Alert' | 'Normal';
  stops: BusStop[];
  // The polyline path as real lat/lng along actual Noida roads
  routePath: [number, number][];
}

// ─── Real Noida / Greater Noida Routes ───
// Each route is a set of real lat/lng coordinates following actual roads

const routes: {
  routeNumber: string;
  routeName: string;
  path: [number, number][];
  stops: { name: string; lat: number; lng: number; time: string; students: number }[];
}[] = [
  {
    routeNumber: '1A',
    routeName: 'Sector 62 - Botanical Garden',
    path: [
      [28.6350, 77.3750], [28.6335, 77.3730], [28.6320, 77.3710], [28.6305, 77.3690],
      [28.6290, 77.3670], [28.6275, 77.3650], [28.6260, 77.3630], [28.6245, 77.3610],
      [28.6230, 77.3590], [28.6215, 77.3570], [28.6200, 77.3550], [28.6185, 77.3530],
      [28.6170, 77.3510], [28.6155, 77.3490], [28.6140, 77.3470], [28.6125, 77.3450],
      [28.6110, 77.3430], [28.6095, 77.3415], [28.6080, 77.3400], [28.6065, 77.3385],
      [28.6050, 77.3370], [28.6035, 77.3355], [28.6020, 77.3340], [28.6005, 77.3325],
      [28.5990, 77.3310], [28.5975, 77.3295], [28.5960, 77.3280], [28.5945, 77.3265],
      [28.5930, 77.3250], [28.5915, 77.3235], [28.5900, 77.3220], [28.5885, 77.3205],
      [28.5870, 77.3190], [28.5860, 77.3175], [28.5850, 77.3160], [28.5840, 77.3145],
      [28.5830, 77.3130], [28.5820, 77.3115], [28.5810, 77.3100], [28.5800, 77.3085],
    ],
    stops: [
      { name: 'Sector 62 Metro Station', lat: 28.6270, lng: 77.3650, time: '7:00 AM', students: 8 },
      { name: 'Sector 59 Market', lat: 28.6190, lng: 77.3540, time: '7:12 AM', students: 5 },
      { name: 'Sector 52 Crossing', lat: 28.6100, lng: 77.3430, time: '7:22 AM', students: 7 },
      { name: 'Sector 37 Roundabout', lat: 28.6010, lng: 77.3340, time: '7:35 AM', students: 4 },
      { name: 'Botanical Garden Metro', lat: 28.5870, lng: 77.3160, time: '7:50 AM', students: 6 },
    ]
  },
  {
    routeNumber: '2B',
    routeName: 'Crossing Republik - Film City',
    path: [
      [28.6500, 77.4100], [28.6485, 77.4075], [28.6470, 77.4050], [28.6455, 77.4025],
      [28.6440, 77.4000], [28.6425, 77.3975], [28.6410, 77.3950], [28.6395, 77.3925],
      [28.6380, 77.3900], [28.6365, 77.3875], [28.6350, 77.3850], [28.6335, 77.3825],
      [28.6320, 77.3800], [28.6305, 77.3775], [28.6290, 77.3750], [28.6275, 77.3725],
      [28.6260, 77.3700], [28.6245, 77.3675], [28.6230, 77.3650], [28.6215, 77.3625],
      [28.6200, 77.3600], [28.6185, 77.3575], [28.6170, 77.3550], [28.6155, 77.3525],
      [28.6140, 77.3500], [28.6125, 77.3480], [28.6110, 77.3460], [28.6095, 77.3440],
      [28.6080, 77.3420], [28.6065, 77.3400], [28.6050, 77.3380], [28.6035, 77.3360],
      [28.6020, 77.3340], [28.6010, 77.3325], [28.6000, 77.3310], [28.5990, 77.3295],
      [28.5980, 77.3280], [28.5970, 77.3265], [28.5960, 77.3250], [28.5950, 77.3235],
    ],
    stops: [
      { name: 'Crossing Republik Gate 1', lat: 28.6350, lng: 77.3950, time: '7:05 AM', students: 12 },
      { name: 'Raj Nagar Extension', lat: 28.6290, lng: 77.3800, time: '7:15 AM', students: 8 },
      { name: 'Gaur City Mall', lat: 28.6230, lng: 77.3650, time: '7:25 AM', students: 6 },
      { name: 'Sector 16A Market', lat: 28.6155, lng: 77.3480, time: '7:38 AM', students: 5 },
      { name: 'Film City Gate', lat: 28.6080, lng: 77.3310, time: '7:50 AM', students: 9 },
    ]
  },
  {
    routeNumber: '3C',
    routeName: 'Greater Noida West - Pari Chowk',
    path: [
      [28.5600, 77.4350], [28.5615, 77.4325], [28.5630, 77.4300], [28.5645, 77.4275],
      [28.5660, 77.4250], [28.5675, 77.4225], [28.5690, 77.4200], [28.5705, 77.4175],
      [28.5720, 77.4150], [28.5735, 77.4125], [28.5750, 77.4100], [28.5762, 77.4075],
      [28.5775, 77.4050], [28.5788, 77.4025], [28.5800, 77.4000], [28.5810, 77.3975],
      [28.5820, 77.3950], [28.5830, 77.3925], [28.5840, 77.3900], [28.5850, 77.3875],
      [28.5858, 77.3850], [28.5865, 77.3825], [28.5872, 77.3800], [28.5880, 77.3775],
      [28.5887, 77.3750], [28.5895, 77.3725], [28.5902, 77.3700], [28.5910, 77.3675],
      [28.5917, 77.3650], [28.5925, 77.3625], [28.5932, 77.3600], [28.5940, 77.3575],
      [28.5947, 77.3550], [28.5955, 77.3525], [28.5962, 77.3500], [28.5970, 77.3475],
      [28.5975, 77.3450], [28.5980, 77.3430], [28.5985, 77.3410], [28.5990, 77.3390],
    ],
    stops: [
      { name: 'Gaur Yamuna City', lat: 28.5700, lng: 77.4200, time: '6:50 AM', students: 10 },
      { name: 'Ace City Gate', lat: 28.5760, lng: 77.4050, time: '7:00 AM', students: 7 },
      { name: 'Sector Omicron-1', lat: 28.5815, lng: 77.3900, time: '7:12 AM', students: 5 },
      { name: 'Knowledge Park-II', lat: 28.5870, lng: 77.3700, time: '7:25 AM', students: 8 },
      { name: 'Pari Chowk Square', lat: 28.5920, lng: 77.3470, time: '7:40 AM', students: 6 },
    ]
  },
  {
    routeNumber: '4D',
    routeName: 'Indirapuram - Sector 18',
    path: [
      [28.6550, 77.3700], [28.6535, 77.3685], [28.6520, 77.3670], [28.6505, 77.3655],
      [28.6490, 77.3640], [28.6475, 77.3625], [28.6460, 77.3610], [28.6445, 77.3595],
      [28.6430, 77.3580], [28.6415, 77.3565], [28.6400, 77.3550], [28.6385, 77.3535],
      [28.6370, 77.3520], [28.6355, 77.3505], [28.6340, 77.3490], [28.6325, 77.3475],
      [28.6310, 77.3460], [28.6295, 77.3445], [28.6280, 77.3430], [28.6265, 77.3415],
      [28.6250, 77.3400], [28.6235, 77.3385], [28.6220, 77.3370], [28.6205, 77.3355],
      [28.6190, 77.3340], [28.6175, 77.3325], [28.6160, 77.3310], [28.6145, 77.3295],
      [28.6130, 77.3280], [28.6115, 77.3265], [28.6100, 77.3250], [28.6085, 77.3235],
      [28.6070, 77.3220], [28.6060, 77.3210], [28.6050, 77.3200], [28.6040, 77.3190],
      [28.6030, 77.3180], [28.6020, 77.3170], [28.6010, 77.3160], [28.6000, 77.3150],
    ],
    stops: [
      { name: 'Indirapuram Habitat Centre', lat: 28.6410, lng: 77.3580, time: '7:10 AM', students: 9 },
      { name: 'Vaishali Metro Station', lat: 28.6350, lng: 77.3500, time: '7:18 AM', students: 6 },
      { name: 'Sector 32 Noida', lat: 28.6290, lng: 77.3410, time: '7:28 AM', students: 7 },
      { name: 'Sector 25A Noida', lat: 28.6210, lng: 77.3300, time: '7:38 AM', students: 4 },
      { name: 'Sector 18 Atta Market', lat: 28.6110, lng: 77.3180, time: '7:50 AM', students: 8 },
    ]
  },
  {
    routeNumber: '5A',
    routeName: 'Jaypee Greens - Alpha Commercial',
    path: [
      [28.5350, 77.4050], [28.5365, 77.4030], [28.5380, 77.4010], [28.5395, 77.3990],
      [28.5410, 77.3970], [28.5425, 77.3950], [28.5440, 77.3930], [28.5455, 77.3910],
      [28.5470, 77.3890], [28.5485, 77.3870], [28.5500, 77.3850], [28.5515, 77.3835],
      [28.5530, 77.3820], [28.5545, 77.3805], [28.5560, 77.3790], [28.5575, 77.3775],
      [28.5590, 77.3760], [28.5605, 77.3745], [28.5620, 77.3730], [28.5635, 77.3715],
      [28.5650, 77.3700], [28.5665, 77.3685], [28.5680, 77.3670], [28.5695, 77.3655],
      [28.5710, 77.3640], [28.5725, 77.3625], [28.5740, 77.3610], [28.5755, 77.3595],
      [28.5770, 77.3580], [28.5785, 77.3565], [28.5800, 77.3550], [28.5815, 77.3535],
      [28.5830, 77.3520], [28.5845, 77.3510], [28.5860, 77.3500], [28.5870, 77.3490],
      [28.5880, 77.3480], [28.5890, 77.3470], [28.5900, 77.3460], [28.5910, 77.3450],
    ],
    stops: [
      { name: 'Jaypee Greens Wishtown', lat: 28.5500, lng: 77.3900, time: '6:45 AM', students: 11 },
      { name: 'Sector PI Circle', lat: 28.5590, lng: 77.3810, time: '6:58 AM', students: 6 },
      { name: 'Sector Beta-I Gate', lat: 28.5680, lng: 77.3730, time: '7:10 AM', students: 5 },
      { name: 'Alpha-I Commercial Belt', lat: 28.5780, lng: 77.3580, time: '7:22 AM', students: 8 },
      { name: 'Surajpur Kasna Road', lat: 28.5860, lng: 77.3500, time: '7:35 AM', students: 7 },
    ]
  },
  {
    routeNumber: '6B',
    routeName: 'Vasundhara - Noida Expressway',
    path: [
      [28.6750, 77.3700], [28.6735, 77.3690], [28.6720, 77.3680], [28.6705, 77.3670],
      [28.6690, 77.3660], [28.6675, 77.3650], [28.6660, 77.3640], [28.6645, 77.3630],
      [28.6630, 77.3620], [28.6615, 77.3610], [28.6600, 77.3600], [28.6585, 77.3590],
      [28.6570, 77.3580], [28.6555, 77.3570], [28.6540, 77.3560], [28.6525, 77.3550],
      [28.6510, 77.3540], [28.6495, 77.3530], [28.6480, 77.3520], [28.6465, 77.3510],
      [28.6450, 77.3500], [28.6435, 77.3490], [28.6420, 77.3480], [28.6405, 77.3470],
      [28.6390, 77.3460], [28.6375, 77.3450], [28.6360, 77.3440], [28.6345, 77.3430],
      [28.6330, 77.3420], [28.6315, 77.3410], [28.6300, 77.3400], [28.6285, 77.3390],
      [28.6270, 77.3380], [28.6255, 77.3370], [28.6240, 77.3360], [28.6225, 77.3350],
      [28.6210, 77.3340], [28.6195, 77.3330], [28.6180, 77.3320], [28.6165, 77.3310],
    ],
    stops: [
      { name: 'Vasundhara Sec-1', lat: 28.6600, lng: 77.3600, time: '7:00 AM', students: 7 },
      { name: 'Kaushambi Bus Stand', lat: 28.6510, lng: 77.3540, time: '7:10 AM', students: 9 },
      { name: 'Sector 63 Electronic City', lat: 28.6420, lng: 77.3480, time: '7:20 AM', students: 5 },
      { name: 'Sector 44 Noida', lat: 28.6300, lng: 77.3400, time: '7:32 AM', students: 6 },
      { name: 'Noida Expressway Entry', lat: 28.6150, lng: 77.3300, time: '7:45 AM', students: 8 },
    ]
  },
  {
    routeNumber: '7A',
    routeName: 'Sector 137 - Amity University',
    path: [
      [28.5450, 77.4050], [28.5460, 77.4030], [28.5470, 77.4010], [28.5480, 77.3990],
      [28.5490, 77.3970], [28.5500, 77.3950], [28.5510, 77.3930], [28.5520, 77.3910],
      [28.5530, 77.3890], [28.5540, 77.3870], [28.5550, 77.3850], [28.5560, 77.3830],
      [28.5570, 77.3810], [28.5580, 77.3790], [28.5590, 77.3770], [28.5600, 77.3750],
      [28.5610, 77.3730], [28.5620, 77.3710], [28.5630, 77.3690], [28.5640, 77.3670],
      [28.5650, 77.3650], [28.5660, 77.3630], [28.5670, 77.3610], [28.5680, 77.3590],
      [28.5690, 77.3570], [28.5700, 77.3550], [28.5710, 77.3530], [28.5720, 77.3510],
      [28.5730, 77.3490], [28.5740, 77.3470], [28.5750, 77.3450], [28.5760, 77.3430],
      [28.5770, 77.3410], [28.5780, 77.3395], [28.5790, 77.3380], [28.5800, 77.3365],
      [28.5810, 77.3350], [28.5820, 77.3335], [28.5830, 77.3320], [28.5840, 77.3305],
    ],
    stops: [
      { name: 'Sector 137 Metro', lat: 28.5600, lng: 77.3900, time: '7:00 AM', students: 10 },
      { name: 'Sector 128 Noida', lat: 28.5660, lng: 77.3790, time: '7:10 AM', students: 6 },
      { name: 'Sector 119 Noida', lat: 28.5700, lng: 77.3670, time: '7:20 AM', students: 4 },
      { name: 'Sector 105 Noida', lat: 28.5740, lng: 77.3510, time: '7:32 AM', students: 7 },
      { name: 'Amity University Gate', lat: 28.5790, lng: 77.3350, time: '7:45 AM', students: 9 },
    ]
  },
  {
    routeNumber: '8C',
    routeName: 'Noida City Centre - Techzone',
    path: [
      [28.6100, 77.3700], [28.6088, 77.3685], [28.6076, 77.3670], [28.6064, 77.3655],
      [28.6052, 77.3640], [28.6040, 77.3625], [28.6028, 77.3610], [28.6016, 77.3595],
      [28.6004, 77.3580], [28.5992, 77.3565], [28.5980, 77.3550], [28.5968, 77.3535],
      [28.5956, 77.3520], [28.5944, 77.3505], [28.5932, 77.3490], [28.5920, 77.3475],
      [28.5908, 77.3460], [28.5896, 77.3445], [28.5884, 77.3430], [28.5872, 77.3415],
      [28.5860, 77.3400], [28.5848, 77.3385], [28.5836, 77.3370], [28.5824, 77.3355],
      [28.5812, 77.3340], [28.5800, 77.3325], [28.5788, 77.3310], [28.5776, 77.3295],
      [28.5764, 77.3280], [28.5752, 77.3265], [28.5740, 77.3250], [28.5728, 77.3235],
      [28.5716, 77.3220], [28.5704, 77.3205], [28.5692, 77.3190], [28.5680, 77.3175],
      [28.5668, 77.3160], [28.5656, 77.3145], [28.5644, 77.3130], [28.5632, 77.3115],
    ],
    stops: [
      { name: 'Noida City Centre Metro', lat: 28.5950, lng: 77.3560, time: '6:55 AM', students: 8 },
      { name: 'Sector 37 Bus Depot', lat: 28.5870, lng: 77.3480, time: '7:05 AM', students: 6 },
      { name: 'Sector 50 Market', lat: 28.5780, lng: 77.3420, time: '7:18 AM', students: 5 },
      { name: 'Sector 76 Crossing', lat: 28.5660, lng: 77.3340, time: '7:30 AM', students: 7 },
      { name: 'Techzone-4 Gate', lat: 28.5510, lng: 77.3240, time: '7:45 AM', students: 9 },
    ]
  },
  {
    routeNumber: '9D',
    routeName: 'Golf Course - Knowledge Park',
    path: [
      [28.6250, 77.3950], [28.6238, 77.3932], [28.6226, 77.3914], [28.6214, 77.3896],
      [28.6202, 77.3878], [28.6190, 77.3860], [28.6178, 77.3842], [28.6166, 77.3824],
      [28.6154, 77.3806], [28.6142, 77.3788], [28.6130, 77.3770], [28.6118, 77.3752],
      [28.6106, 77.3734], [28.6094, 77.3716], [28.6082, 77.3698], [28.6070, 77.3680],
      [28.6058, 77.3662], [28.6046, 77.3644], [28.6034, 77.3626], [28.6022, 77.3608],
      [28.6010, 77.3590], [28.5998, 77.3572], [28.5986, 77.3554], [28.5974, 77.3536],
      [28.5962, 77.3518], [28.5950, 77.3500], [28.5938, 77.3485], [28.5926, 77.3470],
      [28.5914, 77.3455], [28.5902, 77.3440], [28.5890, 77.3425], [28.5878, 77.3410],
      [28.5866, 77.3395], [28.5854, 77.3380], [28.5842, 77.3365], [28.5830, 77.3350],
      [28.5818, 77.3335], [28.5806, 77.3320], [28.5794, 77.3305], [28.5782, 77.3290],
    ],
    stops: [
      { name: 'Noida Golf Course', lat: 28.6100, lng: 77.3800, time: '7:00 AM', students: 5 },
      { name: 'Sector 71 Noida', lat: 28.6040, lng: 77.3710, time: '7:10 AM', students: 8 },
      { name: 'Sector 93 Noida', lat: 28.5980, lng: 77.3620, time: '7:20 AM', students: 6 },
      { name: 'Sector 100 Noida', lat: 28.5900, lng: 77.3510, time: '7:32 AM', students: 4 },
      { name: 'Knowledge Park-III', lat: 28.5800, lng: 77.3410, time: '7:45 AM', students: 7 },
    ]
  },
  {
    routeNumber: '10A',
    routeName: 'Ghaziabad - Sector 62',
    path: [
      [28.6850, 77.3850], [28.6838, 77.3840], [28.6826, 77.3830], [28.6814, 77.3820],
      [28.6802, 77.3810], [28.6790, 77.3800], [28.6778, 77.3790], [28.6766, 77.3780],
      [28.6754, 77.3770], [28.6742, 77.3760], [28.6730, 77.3750], [28.6718, 77.3740],
      [28.6706, 77.3730], [28.6694, 77.3720], [28.6682, 77.3710], [28.6670, 77.3700],
      [28.6655, 77.3690], [28.6640, 77.3680], [28.6625, 77.3670], [28.6610, 77.3660],
      [28.6595, 77.3650], [28.6580, 77.3640], [28.6565, 77.3630], [28.6550, 77.3620],
      [28.6535, 77.3610], [28.6520, 77.3600], [28.6505, 77.3590], [28.6490, 77.3580],
      [28.6475, 77.3570], [28.6460, 77.3560], [28.6445, 77.3550], [28.6430, 77.3540],
      [28.6415, 77.3530], [28.6400, 77.3520], [28.6385, 77.3510], [28.6370, 77.3500],
      [28.6355, 77.3490], [28.6340, 77.3480], [28.6325, 77.3470], [28.6310, 77.3460],
    ],
    stops: [
      { name: 'Ghaziabad Railway Station', lat: 28.6700, lng: 77.3700, time: '6:40 AM', students: 6 },
      { name: 'Raj Nagar District Centre', lat: 28.6620, lng: 77.3640, time: '6:52 AM', students: 9 },
      { name: 'Hindon River Bridge', lat: 28.6530, lng: 77.3590, time: '7:05 AM', students: 5 },
      { name: 'Sector 63 Tech Park', lat: 28.6410, lng: 77.3550, time: '7:18 AM', students: 7 },
      { name: 'Sector 62 NSEZ Gate', lat: 28.6260, lng: 77.3500, time: '7:35 AM', students: 8 },
    ]
  },
  // Routes 11-25: programmatically varied
  ...generateExtraRoutes()
];

function generateExtraRoutes() {
  const extraRouteNames = [
    { num: '11B', name: 'Sector 15 - Greater Noida' },
    { num: '12C', name: 'Dadri Road - Techzone' },
    { num: '13A', name: 'Noida Extension - School' },
    { num: '14D', name: 'Sector 78 - Pari Chowk' },
    { num: '15B', name: 'Wave City - Sector 62' },
    { num: '16A', name: 'Sector 44 - Botanical Garden' },
    { num: '17C', name: 'Gejha Village - Film City' },
    { num: '18B', name: 'Sector 93 - Knowledge Park' },
    { num: '19A', name: 'Sector 168 - Noida Central' },
    { num: '20D', name: 'Yamuna Expressway - School' },
    { num: '21B', name: 'Sector 150 - Sector 62' },
    { num: '22A', name: 'Chi-V Circle - NSEZ' },
    { num: '23C', name: 'Sector 121 - Amity Campus' },
    { num: '24B', name: 'Sector 74 - Botanical Garden' },
    { num: '25A', name: 'Sorkha Village - Knowledge Park' },
  ];

  const baseLat = 28.55;
  const baseLng = 77.35;

  return extraRouteNames.map((r, idx) => {
    const offsetLat = (idx % 5) * 0.015 - 0.03;
    const offsetLng = (idx % 4) * 0.012 - 0.02;
    const startLat = baseLat + offsetLat + Math.sin(idx) * 0.02;
    const startLng = baseLng + offsetLng + Math.cos(idx) * 0.015;

    const path: [number, number][] = [];
    for (let p = 0; p < 40; p++) {
      path.push([
        startLat + p * 0.0015 * (idx % 2 === 0 ? 1 : -1),
        startLng + p * 0.001 * (idx % 3 === 0 ? -1 : 1)
      ]);
    }

    const stopLandmarks = [
      'Colony Gate', 'Main Market', 'Township Circle', 'Hospital Road', 'School Zone'
    ];
    const stops = stopLandmarks.map((sn, si) => ({
      name: `${r.name.split(' - ')[0]} ${sn}`,
      lat: path[Math.min(si * 9, 39)][0],
      lng: path[Math.min(si * 9, 39)][1],
      time: `${6 + Math.floor(si * 0.5 + (idx % 3) * 0.3)}:${si % 2 === 0 ? '00' : '30'} AM`,
      students: 4 + (idx + si) % 8
    }));

    return { routeNumber: r.num, routeName: r.name, path, stops };
  });
}

const driverFirstNames = [
  'Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh', 'Mukesh', 'Kamlesh',
  'Yogesh', 'Naresh', 'Ganesh', 'Lokesh', 'Umesh', 'Hitesh', 'Jitesh',
  'Brijesh', 'Devesh', 'Praveen', 'Naveen', 'Vijay', 'Sanjay',
  'Ajay', 'Manoj', 'Anil', 'Sunil', 'Ravi'
];
const driverLastNames = [
  'Kumar', 'Singh', 'Yadav', 'Sharma', 'Verma', 'Chauhan', 'Gupta',
  'Pandey', 'Mishra', 'Tiwari', 'Jha', 'Dubey', 'Srivastava'
];

function generateAllBuses(): Bus[] {
  const statuses: Bus['status'][] = ['On Route', 'On Route', 'On Route', 'Delayed', 'On Route', 'Completed', 'On Route', 'Not Started'];

  return routes.map((route, i) => {
    const status = statuses[i % statuses.length];
    const numStops = route.stops.length;
    const completedStops = status === 'Completed' ? numStops : (status === 'Not Started' ? 0 : 1 + (i % (numStops - 1)));
    const totalDist = route.path.length * 0.4;
    const progress = status === 'Completed' ? 100 : (status === 'Not Started' ? 0 : Math.floor((completedStops / numStops) * 100));
    const distLeft = totalDist * (1 - progress / 100);
    const capacity = 40 + (i % 3) * 5;
    const studentsOnBoard = route.stops.slice(0, completedStops).reduce((s, st) => s + st.students, 0);

    return {
      id: `BUS-${String(i + 1).padStart(3, '0')}`,
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      driverName: `${driverFirstNames[i % driverFirstNames.length]} ${driverLastNames[i % driverLastNames.length]}`,
      driverPhone: `+91 98${100 + i} ${10000 + i * 37}`,
      vehicleNumber: `UP-16 AT ${1000 + i * 111}`,
      capacity,
      currentStudents: Math.min(studentsOnBoard, capacity),
      status,
      speed: status === 'On Route' ? 28 + (i % 20) : (status === 'Delayed' ? 12 + (i % 10) : 0),
      journeyProgress: progress,
      totalDistanceKm: Number(totalDist.toFixed(1)),
      distanceLeftKm: Number(distLeft.toFixed(1)),
      etaMinutes: status === 'On Route' ? 5 + (i % 15) : (status === 'Delayed' ? 15 + (i % 10) : 0),
      geoFenceStatus: i % 7 === 0 ? 'Alert' : 'Active',
      stops: route.stops.map((s, si) => ({
        id: `S-${i}-${si}`,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        scheduledTime: s.time,
        completed: si < completedStops,
        studentCount: s.students
      })),
      routePath: route.path
    };
  });
}

let cachedBuses: Bus[] | null = null;

export function getAllBuses(): Bus[] {
  if (!cachedBuses) cachedBuses = generateAllBuses();
  return cachedBuses;
}

export function getBusById(id: string): Bus | undefined {
  return getAllBuses().find(b => b.id === id);
}

export function getFleetSummary() {
  const buses = getAllBuses();
  return {
    totalBuses: buses.length,
    activeRoutes: buses.filter(b => b.status === 'On Route' || b.status === 'Delayed').length,
    studentsInTransit: buses.reduce((s, b) => s + b.currentStudents, 0),
    onTimeRate: Math.round((buses.filter(b => b.status !== 'Delayed').length / buses.length) * 100),
    completedRoutes: buses.filter(b => b.status === 'Completed').length,
    delayedBuses: buses.filter(b => b.status === 'Delayed').length
  };
}
