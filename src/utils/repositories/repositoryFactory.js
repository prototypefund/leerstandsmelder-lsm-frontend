import UsersRepository from "./usersRepository.js";
import MapsRepository from "./mapsRepository.js";
import PlaceRepository from "./placeRepository.js";
import ImagesRepository from "./imagesRepository.js";
import CommentsRepository from "./commentsRepository.js";
import AdminRepository from "./adminRepository.js";
import NewsRepository from "./newsRepository.js";

const repositories = {
  users: UsersRepository,
  maps: MapsRepository,
  images: ImagesRepository,
  place: PlaceRepository,
  comments: CommentsRepository,
  admin: AdminRepository,
  news: NewsRepository,
  //other Repos
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
