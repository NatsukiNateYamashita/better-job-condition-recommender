import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let client: any = null;
  
  try {
    // Databricks SQLクライアントを動的にインポート
    let DBSQLClient;
    try {
      const databricksModule = await import('@databricks/sql');
      DBSQLClient = databricksModule.DBSQLClient;
    } catch (importError) {
      console.error('Failed to import @databricks/sql:', importError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Databricks SQL client is not available. Please ensure @databricks/sql is properly installed.' 
        },
        { status: 500 }
      );
    }

    client = new DBSQLClient();
    
    await client.connect({
      token: process.env.DATABRICKS_ACCESS_TOKEN!,
      host: process.env.DATABRICKS_SERVER_HOSTNAME!,
      path: process.env.DATABRICKS_HTTP_PATH!,
    });

    const session = await client.openSession();
    const queryOperation = await session.executeStatement(
      "select * from hive_metastore.jms_prod.scores_overall limit 5",
      {
        runAsync: true,
      }
    );

    const result = await queryOperation.fetchAll();
    await queryOperation.close();
    await session.close();

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Databricks query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute Databricks query' },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing Databricks client:', closeError);
      }
    }
  }
}
