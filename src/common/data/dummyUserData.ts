import dayjs, { Dayjs } from 'dayjs';
import PAYMENTS from './enumPaymentMethod';
import UserImage from '../../assets/img/wanna/wanna1.png';
import UserImageWebp from '../../assets/img/wanna/wanna1.webp';
import UserImage2 from '../../assets/img/wanna/wanna2.png';
import UserImage2Webp from '../../assets/img/wanna/wanna2.webp';
import UserImage3 from '../../assets/img/wanna/wanna3.png';
import UserImage3Webp from '../../assets/img/wanna/wanna3.webp';
import UserImage4 from '../../assets/img/wanna/wanna4.png';
import UserImage4Webp from '../../assets/img/wanna/wanna4.webp';
import UserImage5 from '../../assets/img/wanna/wanna5.png';
import UserImage5Webp from '../../assets/img/wanna/wanna5.webp';
import UserImage6 from '../../assets/img/wanna/wanna6.png';
import UserImage6Webp from '../../assets/img/wanna/wanna6.webp';
import UserImage7 from '../../assets/img/wanna/wanna7.png';
import UserImage7Webp from '../../assets/img/wanna/wanna7.webp';




const usersData =[
  {
    id: 1,
    name: 'Alice Johnson', // Randomized name
    email: 'alice.@example.com', // Randomized email
    type: 'Active',
    membershipDate: dayjs('2022-05-01'),
    balance: 50.5,
    payout: PAYMENTS.PAYPAL.name,
    isOnline: true,
    streetAddress: '123 Main St',
    streetAddress2: 'Apt 1',
    city: 'Springfield',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '62701',
    streetAddressDelivery: '456 Delivery Rd',
    streetAddress2Delivery: 'Apt 2',
    cityDelivery: 'Chicago',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '60007',
    phone: '555-1234',
    latitude: '39.7817',
    longitude: '-89.6501',
    journeyHistory: [
      { date: '2023-01-01', event: 'Scanned at store 1' },
      { date: '2023-02-01', event: 'Scanned at store 2' }
    ],
    scans: 12,
    distanceTraveled: 150.3,
    lastUpdated: '2023-03-10',
    isActive: true,
    src: UserImage,
    srcSet: UserImageWebp,
  },
  {
    id: 2,
    name: 'Mark Harris', // Randomized name
    email: 'mark.harris@example.com', // Randomized email
    type: 'Inactive',
    membershipDate: dayjs('2021-03-15'),
    balance: 120.75,
    payout: PAYMENTS.SWIFT.name,
    isOnline: false,
    streetAddress: '789 Elm St',
    streetAddress2: 'Apt 2',
    city: 'Peoria',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '61602',
    streetAddressDelivery: '101 Delivery St',
    streetAddress2Delivery: 'Apt 3',
    cityDelivery: 'Champaign',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '61820',
    phone: '555-5678',
    latitude: '40.6936',
    longitude: '-89.5890',
    journeyHistory: [
      { date: '2023-02-10', event: 'Scanned at store 1' }
    ],
    scans: 5,
    distanceTraveled: 80.4,
    lastUpdated: '2023-02-28',
    isActive: false,
    src: UserImage2,
    srcSet: UserImage2Webp,
  },
  {
    id: 3,
    name: 'Sarah Lewis', // Randomized name
    email: 'sarah.lewis@example.com', // Randomized email
    type: 'Active',
    membershipDate: dayjs('2023-06-10'),
    balance: 30.5,
    payout: PAYMENTS.PAYPAL.name,
    isOnline: true,
    streetAddress: '321 Oak St',
    streetAddress2: 'Suite 4',
    city: 'Champaign',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '61820',
    streetAddressDelivery: '654 Delivery Ln',
    streetAddress2Delivery: 'Apt 5',
    cityDelivery: 'Peoria',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '61602',
    phone: '555-9876',
    latitude: '40.1164',
    longitude: '-88.2434',
    journeyHistory: [
      { date: '2023-07-01', event: 'Scanned at store 2' },
      { date: '2023-07-15', event: 'Scanned at store 3' }
    ],
    scans: 20,
    distanceTraveled: 200.5,
    lastUpdated: '2023-07-20',
    isActive: true,
    src: UserImage3,
    srcSet: UserImage3Webp,
  },
  {
    id: 4,
    name: 'David Clark', // Randomized name
    email: 'david.clark@example.com', // Randomized email
    type: 'Inactive',
    membershipDate: dayjs('2021-09-12'),
    balance: 45.2,
    payout: PAYMENTS.PAYPAL.name,
    isOnline: false,
    streetAddress: '654 Birch St',
    streetAddress2: 'Apt 6',
    city: 'Decatur',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '62521',
    streetAddressDelivery: '789 Delivery Ln',
    streetAddress2Delivery: 'Suite 2',
    cityDelivery: 'Peoria',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '61602',
    phone: '555-4321',
    latitude: '39.8040',
    longitude: '-88.9562',
    journeyHistory: [
      { date: '2023-03-05', event: 'Scanned at store 4' }
    ],
    scans: 8,
    distanceTraveled: 120.6,
    lastUpdated: '2023-03-15',
    isActive: false,
    src: UserImage4,
    srcSet: UserImage4Webp,
  },
  {
    id: 5,
    name: 'Emily Walker', // Randomized name
    email: 'emily.walker@example.com', // Randomized email
    type: 'Active',
    membershipDate: dayjs('2023-02-05'),
    balance: 80.9,
    payout: PAYMENTS.SWIFT.name,
    isOnline: true,
    streetAddress: '789 Pine St',
    streetAddress2: 'Apt 7',
    city: 'Champaign',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '61821',
    streetAddressDelivery: '101 Delivery Blvd',
    streetAddress2Delivery: 'Suite 4',
    cityDelivery: 'Springfield',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '62701',
    phone: '555-6543',
    latitude: '40.1164',
    longitude: '-88.2436',
    journeyHistory: [
      { date: '2023-02-10', event: 'Scanned at store 5' }
    ],
    scans: 15,
    distanceTraveled: 100.5,
    lastUpdated: '2023-02-25',
    isActive: true,
    src: UserImage5,
    srcSet: UserImage5Webp,
  },
  {
    id: 6,
    name: 'James Moore', // Randomized name
    email: 'james.@example.com', // Randomized email
    type: 'Active',
    membershipDate: dayjs('2022-11-20'),
    balance: 110.3,
    payout: PAYMENTS.PAYONEER.name,
    isOnline: true,
    streetAddress: '111 Maple St',
    streetAddress2: 'Apt 8',
    city: 'Peoria',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '61603',
    streetAddressDelivery: '202 Delivery Rd',
    streetAddress2Delivery: 'Apt 9',
    cityDelivery: 'Chicago',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '60007',
    phone: '555-9877',
    latitude: '40.6936',
    longitude: '-89.5892',
    journeyHistory: [
      { date: '2023-05-10', event: 'Scanned at store 6' },
      { date: '2023-06-10', event: 'Scanned at store 7' }
    ],
    scans: 25,
    distanceTraveled: 180.2,
    lastUpdated: '2023-06-15',
    isActive: true,
    src: UserImage6,
    srcSet: UserImage6Webp,
  },
  {
    id: 7,
    name: 'Jessica Taylor', // Randomized name
    email: 'jessica.@example.com', // Randomized email
    type: 'Inactive',
    membershipDate: dayjs('2020-05-18'),
    balance: 60.7,
    payout: PAYMENTS.PAYONEER.name,
    isOnline: false,
    streetAddress: '222 Birch Rd',
    streetAddress2: 'Suite 3',
    city: 'Decatur',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '62521',
    streetAddressDelivery: '333 Delivery Dr',
    streetAddress2Delivery: 'Suite 2',
    cityDelivery: 'Peoria',
    stateDelivery: 'IL',
    stateFullDelivery: 'Illinois',
    zipDelivery: '61602',
    phone: '555-8765',
    latitude: '39.8040',
    longitude: '-88.9560',
    journeyHistory: [
      { date: '2022-07-07', event: 'Scanned at store 8' }
    ],
    scans: 10,
    distanceTraveled: 140.5,
    lastUpdated: '2023-01-30',
    isActive: false,
    src: UserImage7,
    srcSet: UserImage7Webp,
  }
]

  

  export default usersData;
// export default data;
