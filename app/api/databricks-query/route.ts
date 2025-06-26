import { NextRequest, NextResponse } from 'next/server';
import { configs } from '../../../config/azure';

// SSL証明書の検証を無効化
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export async function POST(request: NextRequest) {  
  try {
    // warehouse_idをhttp_pathから抽出
    const warehouseId = configs.databricks.httpPath.split('/').pop();
    
    const requestBody = {
      statement: "select * from hive_metastore.jms_prod.scores_overall limit 5",
      warehouse_id: warehouseId,
      wait_timeout: "30s"
    };
    
    // Databricks SQL Statement APIを使用
    const response = await fetch(
      `https://${configs.databricks.serverHostname}/api/2.0/sql/statements/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${configs.databricks.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    
    // 実際のデータを抽出
    const resultData = data.result?.data_array || data.data_array || data.result || data;
    
    // データを表形式で整形
    let outputText = '';
    if (Array.isArray(resultData) && resultData.length > 0) {
      outputText = `Query Results (${resultData.length} rows):\n\n`;
      resultData.forEach((row: any[], index: number) => {
        outputText += `Row ${index + 1}:\n`;
        outputText += `  candidate_id: ${row[0]}\n`;
        outputText += `  score_overall: ${row[3]}\n`;
        outputText += `  job_id: ${row[1]}\n`;
        outputText += `  matching_key: ${row[2]}\n`;
        outputText += `  score_commuting_time: ${row[4]}\n`;
        outputText += `  score_job_content: ${row[5]}\n`;
        outputText += `  score_occupation: ${row[6]}\n`;
        outputText += `  ---\n`;
      });
    } else {
      outputText = 'Query executed successfully, but no data returned.';
    }
    
    return NextResponse.json({
      success: true,
      output: outputText
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}