import { Controller, Get, Req, Res } from '@nestjs/common';
import { GithubService } from './github.service';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { DropDownInfo } from 'src/types/action.config';

@Controller('github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private authService: AuthService,
  ) {}

  @Get('repos')
  async getRepos(@Req() request: Request, @Res() response: Response) {
    const accessToken = request.cookies['accessToken'];
    const data = await this.authService.getUser(accessToken);

    const githubAccessToken: string =
      await this.githubService.getUserGithubAccessToken(data.user.id);

    const repos = await this.githubService.getRepos(githubAccessToken);

    const dropdownRepos = repos.data.map(
      (repo : any) =>
        new DropDownInfo({
          label: repo.full_name, // ou repo.name selon ce que vous souhaitez afficher
          value: repo.id.toString(), // Assurez-vous que la valeur est une chaîne
        }),
    );

    response.status(200).json(dropdownRepos);
  }
}
