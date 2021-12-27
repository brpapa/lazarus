import { LocationDTO } from "src/modules/shared/adapter/dtos/location-dto";

export interface UserDTO {
  userId: string
  username: string
  phoneNumber: string
  location?: LocationDTO
}
