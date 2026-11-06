import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SyncGitHubProfileDto {
  @ApiProperty({
    description: 'The GitHub username to sync',
    example: 'torvalds',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class GitHubQueryDto {
  @ApiPropertyOptional({
    description: 'Force cache invalidation and fetch fresh data from GitHub API',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  @IsBoolean()
  force?: boolean;

  @ApiPropertyOptional({
    description: 'Alias for force; force fresh fetch from GitHub API',
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  @IsBoolean()
  refresh?: boolean;
}

export class GitHubDeveloperQueryDto extends GitHubQueryDto {
  @ApiPropertyOptional({
    description: 'The GitHub username when querying via query string parameters',
    example: 'torvalds',
  })
  @IsOptional()
  @IsString()
  username?: string;
}
