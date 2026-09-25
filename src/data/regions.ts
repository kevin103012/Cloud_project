import type { Region } from '../types/cloud'

export const regions: Region[] = [
  {
    id: 'us-east-1',
    name: 'EE. UU. Este (Norte de Virginia)',
    location: 'Virginia, EE. UU.',
    services: ['ec2', 's3', 'rds', 'iam', 'vpc', 'route53', 'cloudfront'],
    status: 'active',
  },
  {
    id: 'eu-west-1',
    name: 'Europa (Irlanda)',
    location: 'Dublín, Irlanda',
    services: ['ec2', 's3', 'rds', 'vpc'],
    status: 'active',
  },
  {
    id: 'sa-east-1',
    name: 'Sudamérica (São Paulo)',
    location: 'São Paulo, Brasil',
    services: ['ec2', 's3', 'rds', 'iam', 'vpc', 'route53', 'cloudfront'],
    status: 'active',
  },
  {
    id: 'us-west-2',
    name: 'EE. UU. Oeste (Oregón)',
    location: 'Oregón, EE. UU.',
    services: ['s3', 'cloudfront'],
    status: 'standby',
  },
]
