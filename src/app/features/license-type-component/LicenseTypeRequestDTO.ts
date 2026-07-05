export interface LicenseTypeRequestDTO {
  name: string;
  description?: string;
  maxUsers: number;
  maxDoctors: number;
  maxPatients: number;
  isCustom: boolean;
  visibleToPublic: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED';
  notes?: string;
  moduleIds: number[];
}