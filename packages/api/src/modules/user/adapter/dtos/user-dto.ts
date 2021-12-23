import { LocationDTO } from "src/shared/adapter/dtos/location-dto";

export interface UserDTO {
  userId: string
  username: string
  phoneNumber: string
  location?: LocationDTO
}
