'use strict';
import Generator from 'yeoman-generator';

export const licenses = [
  { name: 'Apache 2.0', value: 'Apache-2.0' },
  { name: 'MIT', value: 'MIT' },
  { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
  { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
  { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
  { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
  { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
  { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
  { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
  { name: 'Unlicense', value: 'unlicense' },
  { name: 'No License (Copyrighted)', value: 'UNLICENSED' },
];

export default class GeneratorLicense extends Generator {
  private declare gitc: Record<string, any>;
  private declare props: Record<string, any>;

  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    // this is actually improperly typed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(args, options, features);
    this.fs = (this.env as any).fs;

    this.option('name', {
      type: String,
      description: 'Name of the license owner',
    });

    this.option('email', {
      type: String,
      description: 'Email of the license owner',
    });

    this.option('website', {
      type: String,
      description: 'Website of the license owner',
    });

    this.option('year', {
      type: String,
      description: 'Year(s) to include on the license',
      default: new Date().getFullYear(),
    });

    this.option('licensePrompt', {
      type: String,
      description: 'License prompt text',
      default: 'Which license do you want to use?',
      hide: true,
    });

    this.option('defaultLicense', {
      type: String,
      description: 'Default license',
    });

    this.option('license', {
      type: String,
      description:
        'Select a license, so no license prompt will happen, in case you want to handle it outside of this generator',
    });

    this.option('output', {
      type: String,
      description: 'Set the output file for the generated license',
      default: 'LICENSE',
    });

    this.option('publish', {
      type: Boolean,
      description: 'Publish the package',
    });
  }

  initializing() {
    this.gitc = {
      user: {
        name: this.user.git.name(),
        email: this.user.git.email(),
      },
    };
  }

  prompting() {
    const prompts = [
      /*{
        name: 'name',
        message: "What's your name:",
        default: this.options.name || this.gitc.user.name,
        when: this.options.name === undefined,
      },
      {
        name: 'email',
        message: 'Your email (optional):',
        default: this.options.email || this.gitc.user.email,
        when: this.options.email === undefined,
      },
      {
        name: 'website',
        message: 'Your website (optional):',
        default: this.options.website,
        when: this.options.website === undefined,
      },*/
      {
        type: 'list',
        name: 'license',
        message: this.options.licensePrompt,
        default: this.options.defaultLicense,
        when:
          !this.options.license ||
          licenses.find(x => x.value === this.options.license) === undefined,
        choices: licenses,
      },
    ];

    return this.prompt(prompts).then(props => {
      this.props = Object.assign(
        {
          name: this.options.name || this.gitc.user.name,
          email: this.options.email || this.gitc.user.email,
          website: this.options.website,
          license: this.options.license,
        },
        props,
      );
    });
  }

  configuring() {
    // License file
    const filename = this.props.license + '.txt';
    let author = this.props.name.trim();
    if (this.props.email) {
      author += ' <' + this.props.email.trim() + '>';
    }

    if (this.props.website) {
      author += ' (' + this.props.website.trim() + ')';
    }

    this.fs.copyTpl(
      this.templatePath(filename),
      this.destinationPath(this.options.output),
      {
        year: this.options.year,
        author: author,
      },
    );

    // Package
    if (!this.fs.exists(this.destinationPath('package.json'))) {
      return;
    }

    const pkg: any = this.fs.readJSON(this.destinationPath('package.json'), {});
    pkg.license = this.props.license;

    if (
      (this.options.publish === undefined &&
        this.props.license === 'UNLICENSED') ||
      this.options.publish === false
    ) {
      delete pkg.license;
      pkg.private = true;
    }

    this.packageJson.merge(pkg);
  }
}
