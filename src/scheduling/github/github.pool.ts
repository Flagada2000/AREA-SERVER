import { SupabaseClient } from '@supabase/supabase-js';
import { UserActionDto } from 'src/action/dto/action.dto';
import axios from 'axios';
import { Octokit } from 'octokit';

export class GithubPool {
  private supabaseAdmin: SupabaseClient;

  private async newIssue(userAction: UserActionDto) {
    const config: JSON = JSON.parse(userAction.action_config);
    const reposId: string = config['repos_id'];

    if (!reposId) {
      throw new Error('Repos id not found');
    }

    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('github_access_token')
      .eq('user_id', userAction.user_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const githubAccessToken: string = data['github_access_token'];

    if (!githubAccessToken) {
      throw new Error('Github access token not found');
    }

    const octokit = new Octokit({
      auth: githubAccessToken,
    });

    const user = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (user.status !== 200) {
      this.supabaseAdmin
        .from('user_auth')
        .update({ github_access_token: null })
        .eq('user_id', userAction.user_id);
      throw new Error('Github access token invalid');
    }

    const { data: issue } = await octokit.request(
      'GET /repos/{owner}/{repo}/issues',
      {
        owner: user.data.login,
        repo: reposId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    const latestIssue: any = issue[issue.length - 1];
    //   console.log(latestIssue)
    const createdAt = new Date(latestIssue.created_at);
    console.log(createdAt);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    console.log(fiveMinutesAgo);

    if (!(createdAt < fiveMinutesAgo)) {
      console.log('new issue found !');
    }
  }

  private async newCommit(userAction: UserActionDto) {
    const config: JSON = JSON.parse(userAction.action_config);
    const reposId: string = config['repos_id'];

    if (!reposId) {
      throw new Error('Repos id not found');
    }

    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('github_access_token')
      .eq('user_id', userAction.user_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const githubAccessToken: string = data['github_access_token'];

    if (!githubAccessToken) {
      throw new Error('Github access token not found');
    }

    const octokit = new Octokit({
      auth: githubAccessToken,
    });

    const user = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (user.status !== 200) {
      this.supabaseAdmin
        .from('user_auth')
        .update({ github_access_token: null })
        .eq('user_id', userAction.user_id);
      throw new Error('Github access token invalid');
    }

    const { data: commits } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: user.data.login,
        repo: reposId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (commits.length === 0) {
      throw new Error('No commits found');
    }

    const latestCommit: any = commits[commits.length - 1];

    const { data: latestCommitInfo } = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: user.data.login,
        repo: reposId,
        ref: latestCommit.sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const createdAt = new Date(latestCommitInfo.at(0).commit.committer.date);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (!(createdAt < fiveMinutesAgo)) {
      console.log('new commit found !');
    }
  }

  private async newPullRequest(userAction: UserActionDto) {
    const config: JSON = JSON.parse(userAction.action_config);
    const reposId: string = config['repos_id'];

    if (!reposId) {
      throw new Error('Repos id not found');
    }

    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('github_access_token')
      .eq('user_id', userAction.user_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const githubAccessToken: string = data['github_access_token'];

    if (!githubAccessToken) {
      throw new Error('Github access token not found');
    }

    const octokit = new Octokit({
      auth: githubAccessToken,
    });

    const user = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (user.status !== 200) {
      this.supabaseAdmin
        .from('user_auth')
        .update({ github_access_token: null })
        .eq('user_id', userAction.user_id);
      throw new Error('Github access token invalid');
    }

    const { data: pulls } = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls',
      {
        owner: user.data.login,
        repo: reposId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (pulls.length === 0) {
      console.log('No pull request found');
      return;
    }

    const latestPull: any = pulls[pulls.length - 1];

    const createdAt = new Date(latestPull.created_at);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    if (!(createdAt < fiveMinutesAgo)) {
      console.log('new pull request found !');
    }
  }

  private async newBranch(userAction: UserActionDto) {
    let config: any = JSON.parse(userAction.action_config);
    const reposId: string = config['repos_id'];

    if (!reposId) {
      throw new Error('Repos id not found');
    }

    const { data, error } = await this.supabaseAdmin
      .from('user_auth')
      .select('github_access_token')
      .eq('user_id', userAction.user_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const githubAccessToken: string = data['github_access_token'];

    if (!githubAccessToken) {
      throw new Error('Github access token not found');
    }

    const octokit = new Octokit({
      auth: githubAccessToken,
    });

    const user = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (user.status !== 200) {
      this.supabaseAdmin
        .from('user_auth')
        .update({ github_access_token: null })
        .eq('user_id', userAction.user_id);
      throw new Error('Github access token invalid');
    }

    const { data: branchs } = await octokit.request(
      'GET /repos/{owner}/{repo}/branches',
      {
        owner: user.data.login,
        repo: reposId,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (branchs.length <= 1) {
      console.log('No branch found');
      return;
    }

    if (!config.branchs) {
      config.branchs = branchs.map((branch: any) => branch.name);
      await this.supabaseAdmin
        .from('user_actions')
        .update({ action_config: JSON.stringify(config) })
        .eq('id', userAction.id);
    }

    const configBranchs = config.branchs || [];
    const githubBranchs = branchs.map((branch: any) => branch.name);

    const newBranchs = githubBranchs.filter((branch: string) => !configBranchs.includes(branch));


    if (newBranchs.length > 0) {
        config.branchs = branchs.map((branch: any) => branch.name);
        await this.supabaseAdmin
          .from('user_actions')
          .update({ action_config: JSON.stringify(config) })
          .eq('id', userAction.id);
      console.log('New branch(s) found:', newBranchs);
    }
  }

  private actionMap = {
    1: (userAction: UserActionDto) => this.newPullRequest(userAction),
    2: (userAction: UserActionDto) => this.newCommit(userAction),
    3: (userAction: UserActionDto) => this.newIssue(userAction),
    5: (userAction: UserActionDto) => this.newBranch(userAction),
  };

  public handleAction(userAction: UserActionDto) {
    const action = this.actionMap[userAction.action_id];

    console.log(userAction);
    if (action) {
      action(userAction);
    } else {
      throw new Error('Action not found');
    }
  }

  constructor(supabaseAdmin: SupabaseClient) {
    this.supabaseAdmin = supabaseAdmin;
  }
}

export default GithubPool;
