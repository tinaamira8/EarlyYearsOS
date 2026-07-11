
import { userService } from './userService';
import { storageService } from './storageService';
import { childService } from './childService';
import { staffService } from './staffService';
import { financeService } from './financeService';
import { logService } from './logService';
import { documentService } from './documentService';
import { communicationService } from './communicationService';
import { centreService } from './centreService';
import { chefService } from './chefService';

export * from './types';

export const db = {
  ...userService,
  ...storageService,
  ...childService,
  ...staffService,
  ...financeService,
  ...logService,
  ...documentService,
  ...communicationService,
  ...centreService,
  ...chefService,
  
  users: userService,
  storage: storageService,
  children: childService,
  staff: staffService,
  finance: financeService,
  logs: logService,
  documents: documentService,
  communication: communicationService,
  centres: centreService,
  chef: chefService,
};
