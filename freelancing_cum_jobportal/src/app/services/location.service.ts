import { Injectable } from '@angular/core';

export interface LocationData {
  division: string;
  districts: string[];
  upazilas: { [district: string]: string[] };
}

@Injectable({ providedIn: 'root' })
export class LocationService {

  private divisions = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna',
    'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'
  ];

  private districts: { [div: string]: string[] } = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail', 'Kishoreganj', 'Faridpur', 'Rajbari', 'Gopalganj', 'Madaripur', 'Shariatpur'],
    'Chittagong': ['Chittagong', "Cox's Bazar", 'Feni', 'Comilla', 'Noakhali', 'Lakshmipur', 'Chandpur', 'Brahmanbaria', 'Khagrachhari', 'Rangamati', 'Bandarban'],
    'Rajshahi': ['Rajshahi', 'Bogura', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Sirajganj'],
    'Khulna': ['Khulna', 'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    'Sylhet': ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
    'Barisal': ['Barisal', 'Barguna', 'Bhola', 'Jhalokathi', 'Patuakhali', 'Pirojpur'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
  };

  getDivisions(): string[] {
    return this.divisions;
  }

  getDistricts(division: string): string[] {
    return this.districts[division] || [];
  }

  // Can be extended with actual upazila data
  getUpazilas(district: string): string[] {
    return [];
  }
}