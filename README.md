<h1>Installation Instructions</h1>
<p>This repository contains a project that requires some initial setup in order to run. Follow the instructions below to properly install and configure the project.</p>

<h2>Installation</h2>
<ol>
  <li>Clone the repository to your local machine.</li>
  <li>Run <code>npm install</code> in the root directory of the project to install the necessary dependencies.</li>
</ol>

<h2>Configuration</h2>
<ol>
  <li>In the root directory of the project, create a <code>.env</code> file.</li>
  <li>Open the <code>.env.dist</code> file and copy its contents into the <code>.env</code> file.</li>
  <li>Fill in the appropriate values for the fields in the <code>.env</code> file.</li>
</ol>

<h2>Running the Project Dev</h2>
<p>Once the installation and configuration are complete, you can run the project using the following command:</p>
<pre>
<code>npm run-script start:dev</code>
</pre>

<h2>Running the Project Prod</h2>
<p>Once the installation and configuration are complete, you can run the project using the following command:</p>
<pre>
<code>npm run-script build</code>
<code>npm run-script start</code>
</pre>
